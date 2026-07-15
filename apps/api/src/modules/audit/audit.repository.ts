import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../shared/prisma/prisma.service";
import type { TenantContext } from "../tenancy/tenant-context.types";
import type { CreateAuditLogDto } from "./dto/create-audit-log.dto";

@Injectable()
export class AuditRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(context: TenantContext, dto: CreateAuditLogDto) {
    return this.prisma.auditLog.create({
      data: {
        tenantId: context.tenantId,
        companyId: context.companyId,
        branchId: context.branchId,
        warehouseId: context.warehouseId,
        actorUserId: context.userId,
        action: dto.action,
        entity: dto.entity,
        entityId: dto.entityId,
        before: dto.before as Prisma.InputJsonValue | undefined,
        after: dto.after as Prisma.InputJsonValue | undefined,
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
      },
    });
  }
}
