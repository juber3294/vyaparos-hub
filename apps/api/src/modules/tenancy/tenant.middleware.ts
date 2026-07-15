import { BadRequestException, Injectable, NestMiddleware } from "@nestjs/common";
import type { NextFunction, Request, Response } from "express";
import { randomUUID } from "node:crypto";
import { TenantContextService } from "./tenant-context.service";

const publicPathPrefixes = ["/api/v1/docs", "/api/v1/health"];

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private readonly tenantContext: TenantContextService) {}

  use(request: Request, _response: Response, next: NextFunction) {
    const requestId = String(request.headers["x-request-id"] ?? randomUUID());
    const tenantId = header(request, "x-tenant-id");
    const isPublicPath = publicPathPrefixes.some((path) => request.originalUrl.startsWith(path));

    if (!tenantId && !isPublicPath) {
      throw new BadRequestException("x-tenant-id header is required");
    }

    this.tenantContext.run(
      {
        tenantId: tenantId ?? "system",
        companyId: header(request, "x-company-id"),
        branchId: header(request, "x-branch-id"),
        warehouseId: header(request, "x-warehouse-id"),
        requestId,
        ipAddress: request.ip,
        userAgent: request.headers["user-agent"],
      },
      next,
    );
  }
}

function header(request: Request, key: string): string | undefined {
  const value = request.headers[key];
  return Array.isArray(value) ? value[0] : value;
}
