import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsIn, IsObject, IsOptional, IsString } from "class-validator";

const actions = [
  "LOGIN",
  "LOGOUT",
  "CREATE",
  "UPDATE",
  "DELETE",
  "STOCK_IN",
  "STOCK_OUT",
  "TRANSFER",
  "ADJUSTMENT",
  "INVOICE",
  "PURCHASE",
  "USER_CHANGE",
] as const;

export class CreateAuditLogDto {
  @ApiProperty({ enum: actions })
  @IsIn(actions)
  action!: (typeof actions)[number];

  @ApiProperty()
  @IsString()
  entity!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  entityId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  before?: Record<string, unknown>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  after?: Record<string, unknown>;
}
