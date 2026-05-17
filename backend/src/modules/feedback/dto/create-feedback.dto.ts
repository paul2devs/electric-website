import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateFeedbackDto {
  @IsString()
  @MinLength(10)
  @MaxLength(4000)
  message!: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  name?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(254)
  email?: string;
}
