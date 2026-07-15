import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuditModule } from "../audit/audit.module";
import { RbacModule } from "../rbac/rbac.module";
import { UsersModule } from "../users/users.module";
import { AuthController } from "./auth.controller";
import { AuthRepository } from "./auth.repository";
import { AuthService } from "./auth.service";
import { TokenService } from "./token.service";

@Module({
  imports: [JwtModule.register({}), UsersModule, RbacModule, AuditModule],
  controllers: [AuthController],
  providers: [AuthRepository, AuthService, TokenService],
  exports: [TokenService, AuthService],
})
export class AuthModule {}
