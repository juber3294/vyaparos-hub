import { Injectable } from "@nestjs/common";
import { TenantContextService } from "../tenancy/tenant-context.service";
import type { CreateAuditLogDto } from "./dto/create-audit-log.dto";
import { AuditRepository } from "./audit.repository";

@Injectable()
export class AuditService {
  constructor(
    private readonly repository: AuditRepository,
    private readonly tenantContext: TenantContextService,
  ) {}

  async record(dto: CreateAuditLogDto) {
    return this.repository.create(this.tenantContext.getRequired(), dto);
  }
}
