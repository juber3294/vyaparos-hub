import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsString } from "class-validator";

export class RequestOtpDto {
  @ApiProperty({ example: "+919820012345" })
  @IsString()
  destination!: string;

  @ApiProperty({ enum: ["LOGIN", "PASSWORD_RESET", "2FA"] })
  @IsIn(["LOGIN", "PASSWORD_RESET", "2FA"])
  purpose!: "LOGIN" | "PASSWORD_RESET" | "2FA";
}
