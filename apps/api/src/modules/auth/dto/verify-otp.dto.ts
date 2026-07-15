import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, Length } from "class-validator";

export class VerifyOtpDto {
  @ApiProperty()
  @IsString()
  challengeId!: string;

  @ApiProperty()
  @IsString()
  @Length(6, 6)
  code!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  deviceId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  deviceName?: string;
}
