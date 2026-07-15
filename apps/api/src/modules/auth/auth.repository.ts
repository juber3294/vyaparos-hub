import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../shared/prisma/prisma.service";

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  createSession(data: {
    tenantId: string;
    userId: string;
    refreshTokenHash: string;
    ipAddress?: string;
    userAgent?: string;
    deviceId?: string;
    deviceName?: string;
    expiresAt: Date;
  }) {
    return this.prisma.session.create({ data });
  }

  findActiveSession(sessionId: string, tenantId: string) {
    return this.prisma.session.findFirst({
      where: { id: sessionId, tenantId, status: "ACTIVE", expiresAt: { gt: new Date() } },
    });
  }

  revokeSession(sessionId: string, tenantId: string) {
    return this.prisma.session.updateMany({
      where: { id: sessionId, tenantId, status: "ACTIVE" },
      data: { status: "REVOKED", revokedAt: new Date() },
    });
  }

  revokeUserSessions(userId: string, tenantId: string) {
    return this.prisma.session.updateMany({
      where: { userId, tenantId, status: "ACTIVE" },
      data: { status: "REVOKED", revokedAt: new Date() },
    });
  }

  updateSessionRefreshHash(sessionId: string, tenantId: string, refreshTokenHash: string) {
    return this.prisma.session.updateMany({
      where: { id: sessionId, tenantId, status: "ACTIVE" },
      data: { refreshTokenHash },
    });
  }

  createOtpChallenge(data: {
    tenantId: string;
    destination: string;
    purpose: string;
    codeHash: string;
    expiresAt: Date;
  }) {
    return this.prisma.otpChallenge.create({ data });
  }

  findOtpChallenge(challengeId: string, tenantId: string) {
    return this.prisma.otpChallenge.findFirst({
      where: { id: challengeId, tenantId, consumedAt: null, expiresAt: { gt: new Date() } },
    });
  }

  markOtpConsumed(challengeId: string) {
    return this.prisma.otpChallenge.update({
      where: { id: challengeId },
      data: { consumedAt: new Date() },
    });
  }

  incrementOtpAttempts(challengeId: string, attempts: number) {
    return this.prisma.otpChallenge.update({
      where: { id: challengeId },
      data: { attempts },
    });
  }

  createPasswordReset(data: {
    tenantId: string;
    userId: string;
    tokenHash: string;
    expiresAt: Date;
  }) {
    return this.prisma.passwordResetToken.create({ data });
  }

  findPasswordResetByHash(tokenHash: string, tenantId: string) {
    return this.prisma.passwordResetToken.findFirst({
      where: { tokenHash, tenantId, usedAt: null, expiresAt: { gt: new Date() } },
    });
  }

  markPasswordResetUsed(id: string) {
    return this.prisma.passwordResetToken.update({
      where: { id },
      data: { usedAt: new Date() },
    });
  }

  updateUserPassword(userId: string, passwordHash: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash, failedLoginCount: 0, lockedUntil: null },
    });
  }
}
