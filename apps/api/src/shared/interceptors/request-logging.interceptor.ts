import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import type { Request, Response } from "express";
import { Observable, tap } from "rxjs";

@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();
    const startedAt = Date.now();

    return next.handle().pipe(
      tap(() => {
        this.logger.log({
          method: request.method,
          url: request.originalUrl,
          statusCode: response.statusCode,
          durationMs: Date.now() - startedAt,
          tenantId: request.headers["x-tenant-id"],
          userId:
            request.user && typeof request.user === "object"
              ? "id" in request.user
                ? request.user.id
                : undefined
              : undefined,
        });
      }),
    );
  }
}
