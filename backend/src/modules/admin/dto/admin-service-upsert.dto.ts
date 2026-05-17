import { IsNumber, IsOptional, IsString, MaxLength, Min, MinLength } from "class-validator";

export class AdminServiceUpsertDto {
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  slug?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  imageUrl?: string;

  @IsString()
  @MinLength(2)
  @MaxLength(80)
  category!: string;

  @IsNumber()
  @Min(0)
  basePrice!: number;

  @IsNumber()
  @Min(15)
  duration!: number;
}
