import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { Request } from "express";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";
import { TokenService } from "../token.service";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly tokens: TokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const authorization = request.headers.authorization;
    if (!authorization?.startsWith("Bearer ")) {
      throw new UnauthorizedException("Bearer access token is required");
    }

    const payload = await this.tokens.verifyAccess(authorization.slice(7)).catch(() => {
      throw new UnauthorizedException("Invalid or expired access token");
    });
    request.user = {
      id: payload.sub,
      tenantId: payload.tenantId,
      companyId: payload.companyId,
      branchId: payload.branchId,
      warehouseId: payload.warehouseId,
      roles: payload.roles,
      permissions: payload.permissions,
    };
    return true;
  }
}
