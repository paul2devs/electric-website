import { IsArray, IsEnum, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

import { TechnicianStatus } from "@prisma/client";

export class UpdateTechnicianDto {
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  @IsOptional()
  name?: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @IsOptional()
  phone?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  skills?: string[];

  @IsEnum(TechnicianStatus)
  @IsOptional()
  status?: TechnicianStatus;
}
