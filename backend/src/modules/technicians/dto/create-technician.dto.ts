import { IsArray, IsEnum, IsString, MaxLength, MinLength } from "class-validator";

import { TechnicianStatus } from "@prisma/client";

export class CreateTechnicianDto {
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  name!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  phone!: string;

  @IsArray()
  @IsString({ each: true })
  skills!: string[];

  @IsEnum(TechnicianStatus)
  status!: TechnicianStatus;
}
