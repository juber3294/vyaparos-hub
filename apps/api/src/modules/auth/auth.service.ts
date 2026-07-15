import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import argon2 from "argon2";
import { createHmac, randomBytes, randomInt } from "node:crypto";
import { addDays, addMinutes } from "date-fns";
import { AuditService } from "../audit/audit.service";
import { RbacService } from "../rbac/rbac.service";
import { TenantContextService } from "../tenancy/tenant-context.service";
import { UsersRepository } from "../users/users.repository";
import { AuthRepository } from "./auth.repository";
import type { LoginDto } from "./dto/login.dto";
import type { RequestOtpDto } from "./dto/request-otp.dto";
import type { VerifyOtpDto } from "./dto/verify-otp.dto";
import type { ForgotPasswordDto } from "./dto/forgot-password.dto";
import type { ResetPasswordDto } from "./dto/reset-password.dto";
import { TokenService } from "./token.service";
import type { AuthenticatedUser } from "./types/authenticated-user.type";

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersRepository,
    private readonly auth: AuthRepository,
    private readonly rbac: RbacService,
    private readonly tokens: TokenService,
    private readonly config: ConfigService,
    private readonly tenantContext: TenantContextService,
    private readonly audit: AuditService,
  ) {}

  async login(dto: LoginDto) {
    const context = this.tenantContext.getRequired();
    const user = dto.identifier.includes("@")
      ? await this.users.findByEmail(dto.identifier, context.tenantId)
      : await this.users.findByPhone(dto.identifier, context.tenantId);

    if (!user || !user.passwordHash || user.status !== "ACTIVE") {
      throw new UnauthorizedException("Invalid credentials");
    }
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new UnauthorizedException("Account is temporarily locked");
    }

    const ok = await argon2.verify(user.passwordHash, dto.password + this.passwordPepper);
    if (!ok) {
      const failures = user.failedLoginCount + 1;
      await this.users.updateLoginFailure(
        user.id,
        failures,
        failures >= 5 ? addMinutes(new Date(), 15) : undefined,
      );
      throw new UnauthorizedException("Invalid credentials");
    }

    await this.users.updateLoginSuccess(user.id);
    const authenticated = await this.toAuthenticatedUser(user);
    const { session, tokens } = await this.createSession(
      authenticated,
      dto.deviceId,
      dto.deviceName,
    );
    await this.audit.record({ action: "LOGIN", entity: "Session", entityId: session.id });
    return {
      user: authenticated,
      ...tokens,
    };
  }

  async refresh(refreshToken: string) {
    const context = this.tenantContext.getRequired();
    const payload = await this.tokens.verifyRefresh(refreshToken).catch(() => {
      throw new UnauthorizedException("Invalid refresh token");
    });
    if (payload.tenantId !== context.tenantId) {
      throw new UnauthorizedException("Invalid tenant token");
    }

    const session = await this.auth.findActiveSession(payload.sid, context.tenantId);
    if (!session || !(await argon2.verify(session.refreshTokenHash, refreshToken))) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const user = await this.users.findById(payload.sub, context.tenantId);
    if (!user || user.status !== "ACTIVE") {
      throw new UnauthorizedException("User is not active");
    }

    const authenticated = await this.toAuthenticatedUser(user);
    return this.tokens.issueTokens(authenticated, session.id);
  }

  async logout(refreshToken: string) {
    const context = this.tenantContext.getRequired();
    const payload = await this.tokens.verifyRefresh(refreshToken).catch(() => {
      throw new UnauthorizedException("Invalid refresh token");
    });
    await this.auth.revokeSession(payload.sid, context.tenantId);
    await this.audit.record({ action: "LOGOUT", entity: "Session", entityId: payload.sid });
    return { ok: true };
  }

  async requestOtp(dto: RequestOtpDto) {
    const context = this.tenantContext.getRequired();
    const code = String(randomInt(100000, 1000000));
    const challenge = await this.auth.createOtpChallenge({
      tenantId: context.tenantId,
      destination: dto.destination,
      purpose: dto.purpose,
      codeHash: await argon2.hash(code + this.passwordPepper),
      expiresAt: addMinutes(new Date(), 10),
    });

    return {
      challengeId: challenge.id,
      expiresAt: challenge.expiresAt,
      delivery: "queued",
      devCode: this.config.get("NODE_ENV") === "production" ? undefined : code,
    };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const context = this.tenantContext.getRequired();
    const challenge = await this.auth.findOtpChallenge(dto.challengeId, context.tenantId);
    if (!challenge || challenge.attempts >= 5) {
      throw new BadRequestException("Invalid OTP challenge");
    }

    const valid = await argon2.verify(challenge.codeHash, dto.code + this.passwordPepper);
    if (!valid) {
      await this.auth.incrementOtpAttempts(challenge.id, challenge.attempts + 1);
      throw new BadRequestException("Invalid OTP");
    }

    await this.auth.markOtpConsumed(challenge.id);
    const user = await this.users.findByPhone(challenge.destination, context.tenantId);
    if (!user) {
      throw new UnauthorizedException("No active user found for OTP login");
    }

    const authenticated = await this.toAuthenticatedUser(user);
    const { session, tokens } = await this.createSession(
      authenticated,
      dto.deviceId,
      dto.deviceName,
    );
    await this.audit.record({ action: "LOGIN", entity: "Session", entityId: session.id });
    return {
      user: authenticated,
      ...tokens,
    };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const context = this.tenantContext.getRequired();
    const user = dto.identifier.includes("@")
      ? await this.users.findByEmail(dto.identifier, context.tenantId)
      : await this.users.findByPhone(dto.identifier, context.tenantId);
    if (!user) {
      return { ok: true };
    }
    const token = randomBytes(32).toString("base64url");
    await this.auth.createPasswordReset({
      tenantId: context.tenantId,
      userId: user.id,
      tokenHash: await this.hashOpaqueToken(token),
      expiresAt: addMinutes(new Date(), 30),
    });
    return {
      ok: true,
      devToken: this.config.get("NODE_ENV") === "production" ? undefined : token,
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const context = this.tenantContext.getRequired();
    const tokenHash = await this.hashOpaqueToken(dto.token);
    const reset = await this.auth.findPasswordResetByHash(tokenHash, context.tenantId);
    if (!reset) {
      throw new BadRequestException("Invalid reset token");
    }
    await this.auth.updateUserPassword(reset.userId, await this.hashPassword(dto.newPassword));
    await this.auth.markPasswordResetUsed(reset.id);
    await this.auth.revokeUserSessions(reset.userId, context.tenantId);
    await this.audit.record({ action: "USER_CHANGE", entity: "User", entityId: reset.userId });
    return { ok: true };
  }

  private async createSession(user: AuthenticatedUser, deviceId?: string, deviceName?: string) {
    const context = this.tenantContext.getRequired();
    const session = await this.auth.createSession({
      tenantId: context.tenantId,
      userId: user.id,
      refreshTokenHash: await argon2.hash(randomBytes(32).toString("base64url")),
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      deviceId,
      deviceName,
      expiresAt: addDays(new Date(), 30),
    });
    const issued = await this.tokens.issueTokens(user, session.id);
    await this.auth.updateSessionRefreshHash(
      session.id,
      context.tenantId,
      await argon2.hash(issued.refreshToken),
    );
    return { session, tokens: issued };
  }

  private async toAuthenticatedUser(user: {
    id: string;
    tenantId: string;
    companyId?: string | null;
    branchId?: string | null;
    warehouseId?: string | null;
    email?: string | null;
    phone?: string | null;
  }): Promise<AuthenticatedUser> {
    const security = await this.rbac.getUserSecurityProfile(user.id, user.tenantId);
    return {
      id: user.id,
      tenantId: user.tenantId,
      companyId: user.companyId,
      branchId: user.branchId,
      warehouseId: user.warehouseId,
      email: user.email,
      phone: user.phone,
      ...security,
    };
  }

  private hashPassword(password: string) {
    return argon2.hash(password + this.passwordPepper, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 1,
    });
  }

  private async hashOpaqueToken(token: string) {
    return createHmac("sha256", this.config.getOrThrow<string>("ENCRYPTION_KEY"))
      .update(token)
      .digest("base64url");
  }

  private get passwordPepper() {
    return this.config.getOrThrow<string>("PASSWORD_PEPPER");
  }
}
