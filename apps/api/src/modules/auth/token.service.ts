import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import type { AuthenticatedUser, JwtAccessPayload } from "./types/authenticated-user.type";

@Injectable()
export class TokenService {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async issueTokens(user: AuthenticatedUser, sessionId: string) {
    const payload: JwtAccessPayload = {
      sub: user.id,
      tenantId: user.tenantId,
      companyId: user.companyId,
      branchId: user.branchId,
      warehouseId: user.warehouseId,
      roles: user.roles,
      permissions: user.permissions,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: this.config.getOrThrow<string>("JWT_ACCESS_SECRET"),
        expiresIn: ttlToSeconds(this.config.getOrThrow<string>("JWT_ACCESS_TTL")),
      }),
      this.jwt.signAsync(
        { sub: user.id, tenantId: user.tenantId, sid: sessionId },
        {
          secret: this.config.getOrThrow<string>("JWT_REFRESH_SECRET"),
          expiresIn: ttlToSeconds(this.config.getOrThrow<string>("JWT_REFRESH_TTL")),
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  verifyAccess(token: string) {
    return this.jwt.verifyAsync<JwtAccessPayload>(token, {
      secret: this.config.getOrThrow<string>("JWT_ACCESS_SECRET"),
    });
  }

  verifyRefresh(token: string) {
    return this.jwt.verifyAsync<{ sub: string; tenantId: string; sid: string }>(token, {
      secret: this.config.getOrThrow<string>("JWT_REFRESH_SECRET"),
    });
  }
}

function ttlToSeconds(value: string): number {
  const match = /^(\d+)([smhd])?$/.exec(value);
  if (!match) {
    throw new Error(`Invalid JWT TTL: ${value}`);
  }
  const amount = Number(match[1]);
  const unit = match[2] ?? "s";
  const multiplier: Record<string, number> = {
    s: 1,
    m: 60,
    h: 60 * 60,
    d: 24 * 60 * 60,
  };
  return amount * multiplier[unit];
}
