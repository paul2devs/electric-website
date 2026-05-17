import { IsString, Matches, MinLength } from "class-validator";

export class ResetPasswordDto {
  @IsString()
  token!: string;

  @IsString()
  @MinLength(8)
  @Matches(/[A-Z]/, { message: "Password must include an uppercase letter" })
  @Matches(/\d/, { message: "Password must include a number" })
  password!: string;
}
