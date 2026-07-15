import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import argon2 from "argon2";
import { PaginationDto } from "../../shared/dto/pagination.dto";
import { AuditService } from "../audit/audit.service";
import { TenantContextService } from "../tenancy/tenant-context.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UsersRepository } from "./users.repository";

@Injectable()
export class UsersService {
  constructor(
    private readonly users: UsersRepository,
    private readonly tenantContext: TenantContextService,
    private readonly config: ConfigService,
    private readonly audit: AuditService,
  ) {}

  async create(dto: CreateUserDto) {
    const context = this.tenantContext.getRequired();
    if (dto.email && (await this.users.findByEmail(dto.email, context.tenantId))) {
      throw new ConflictException("Email already exists for this tenant");
    }
    if (dto.phone && (await this.users.findByPhone(dto.phone, context.tenantId))) {
      throw new ConflictException("Phone already exists for this tenant");
    }

    const user = await this.users.create({
      tenantId: context.tenantId,
      companyId: dto.companyId ?? context.companyId,
      branchId: dto.branchId ?? context.branchId,
      warehouseId: dto.warehouseId ?? context.warehouseId,
      email: dto.email,
      phone: dto.phone,
      fullName: dto.fullName,
      passwordHash: await this.hashPassword(dto.password),
    });

    await this.audit.record({
      action: "USER_CHANGE",
      entity: "User",
      entityId: user.id,
      after: { email: user.email, phone: user.phone, status: user.status },
    });

    return sanitizeUser(user);
  }

  async findById(id: string) {
    const context = this.tenantContext.getRequired();
    const user = await this.users.findById(id, context.tenantId);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return sanitizeUser(user);
  }

  list(query: PaginationDto) {
    return this.users.list(this.tenantContext.getRequired().tenantId, query);
  }

  private hashPassword(password: string) {
    return argon2.hash(password + this.config.getOrThrow<string>("PASSWORD_PEPPER"), {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 1,
    });
  }
}

function sanitizeUser<T extends { passwordHash?: string | null }>(user: T) {
  const { passwordHash: _passwordHash, ...safe } = user;
  return safe;
}
