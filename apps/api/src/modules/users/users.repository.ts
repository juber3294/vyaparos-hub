import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../shared/prisma/prisma.service";
import type { PaginationDto } from "../../shared/dto/pagination.dto";

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string, tenantId: string) {
    return this.prisma.user.findFirst({
      where: { id, tenantId, deletedAt: null },
    });
  }

  findByEmail(email: string, tenantId: string) {
    return this.prisma.user.findFirst({
      where: { email: email.toLowerCase(), tenantId, deletedAt: null },
    });
  }

  findByPhone(phone: string, tenantId: string) {
    return this.prisma.user.findFirst({
      where: { phone, tenantId, deletedAt: null },
    });
  }

  async list(tenantId: string, query: PaginationDto) {
    const where = {
      tenantId,
      deletedAt: null,
      ...(query.search
        ? {
            OR: [
              { fullName: { contains: query.search, mode: "insensitive" as const } },
              { email: { contains: query.search, mode: "insensitive" as const } },
              { phone: { contains: query.search, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { [query.sortBy ?? "createdAt"]: query.sortOrder },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data,
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  }

  create(data: {
    tenantId: string;
    companyId?: string;
    branchId?: string;
    warehouseId?: string;
    email?: string;
    phone?: string;
    fullName: string;
    passwordHash: string;
  }) {
    return this.prisma.user.create({
      data: {
        ...data,
        email: data.email?.toLowerCase(),
        status: "ACTIVE",
      },
    });
  }

  updateLoginSuccess(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { lastLoginAt: new Date(), failedLoginCount: 0, lockedUntil: null },
    });
  }

  updateLoginFailure(userId: string, failedLoginCount: number, lockedUntil?: Date) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { failedLoginCount, lockedUntil },
    });
  }
}
