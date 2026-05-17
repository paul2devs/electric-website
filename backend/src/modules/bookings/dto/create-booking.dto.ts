import {
  ArrayUnique,
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";

export class CreateBookingDto {
  @IsUUID()
  serviceId!: string;

  @IsDateString()
  date!: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  time!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(40)
  phone!: string;

  @IsString()
  @MinLength(5)
  @MaxLength(300)
  address!: string;

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  notes?: string;

  @IsNumber()
  @Min(0)
  @Max(999)
  mockDistanceKm!: number;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsUUID("4", { each: true })
  addOnIds?: string[];

  @IsNumber()
  @Min(0)
  quotedTotal!: number;

  @IsString()
  lockToken!: string;
}
