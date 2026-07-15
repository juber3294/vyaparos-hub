import { BullModule } from "@nestjs/bullmq";
import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { WinstonModule } from "nest-winston";
import { AuditModule } from "./modules/audit/audit.module";
import { AuthModule } from "./modules/auth/auth.module";
import { HealthModule } from "./modules/health/health.module";
import { RbacModule } from "./modules/rbac/rbac.module";
import { TenancyModule } from "./modules/tenancy/tenancy.module";
import { TenantMiddleware } from "./modules/tenancy/tenant.middleware";
import { UsersModule } from "./modules/users/users.module";
import { envSchema } from "./shared/config/env.schema";
import { PrismaModule } from "./shared/prisma/prisma.module";
import { createWinstonLogger } from "./shared/logging/winston.config";
import { JwtAuthGuard } from "./modules/auth/guards/jwt-auth.guard";
import { PermissionsGuard } from "./modules/rbac/guards/permissions.guard";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate: (raw) => envSchema.parse(raw),
    }),
    WinstonModule.forRoot(createWinstonLogger()),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.getOrThrow<number>("RATE_LIMIT_TTL"),
          limit: config.getOrThrow<number>("RATE_LIMIT_LIMIT"),
        },
      ],
    }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: { url: config.getOrThrow<string>("REDIS_URL") },
        defaultJobOptions: {
          attempts: 5,
          backoff: { type: "exponential", delay: 5000 },
          removeOnComplete: 1000,
          removeOnFail: 5000,
        },
      }),
    }),
    PrismaModule,
    TenancyModule,
    AuditModule,
    RbacModule,
    UsersModule,
    AuthModule,
    HealthModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: PermissionsGuard },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes("*");
  }
}
