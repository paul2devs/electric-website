import { Transform } from "class-transformer";
import { IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class UpdateProfileDto {
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  @IsOptional()
  name?: string;

  @IsOptional()
  @Transform(({ value }) => (typeof value === "string" && value.trim() === "" ? undefined : value))
  @IsString()
  @MinLength(10)
  @MaxLength(24)
  @Matches(/^[0-9+\s().-]+$/, {
    message: "Phone may only include digits, spaces, and + ( ) . -",
  })
  phone?: string;

  @IsString()
  @MinLength(5)
  @MaxLength(300)
  @IsOptional()
  address?: string;
}
