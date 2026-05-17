import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateBy,
  ValidationArguments,
} from "class-validator";

export class RegisterDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(10)
  @MaxLength(24)
  @Matches(/^[0-9+\s().-]+$/, {
    message: "Phone may only include digits, spaces, and + ( ) . -",
  })
  phone!: string;

  @IsString()
  @MinLength(8)
  @Matches(/[A-Z]/, { message: "Password must include an uppercase letter" })
  @Matches(/\d/, { message: "Password must include a number" })
  password!: string;

  @IsString()
  @ValidateBy({
    name: "isEqualToPassword",
    validator: {
      validate(value: unknown, args: ValidationArguments) {
        const dto = args.object as RegisterDto;
        return typeof value === "string" && value === dto.password;
      },
      defaultMessage: () => "Passwords must match",
    },
  })
  confirmPassword!: string;
}
