import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { PaginationDto } from "../../shared/dto/pagination.dto";
import { RequirePermissions } from "../rbac/decorators/permissions.decorator";
import { CreateUserDto } from "./dto/create-user.dto";
import { UsersService } from "./users.service";

@ApiTags("Users")
@ApiBearerAuth()
@Controller("users")
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Post()
  @RequirePermissions("users:create:user")
  create(@Body() dto: CreateUserDto) {
    return this.users.create(dto);
  }

  @Get()
  @RequirePermissions("users:read:user")
  list(@Query() query: PaginationDto) {
    return this.users.list(query);
  }

  @Get(":id")
  @RequirePermissions("users:read:user")
  findById(@Param("id") id: string) {
    return this.users.findById(id);
  }
}
