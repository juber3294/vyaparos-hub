import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class ForgotPasswordDto {
  @ApiProperty({ example: "owner@sharmatraders.in" })
  @IsString()
  identifier!: string;
}
