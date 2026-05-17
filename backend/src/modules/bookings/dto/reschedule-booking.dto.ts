import {
  IsDateString,
  IsNumber,
  IsString,
  Matches,
  Min,
} from "class-validator";

export class RescheduleBookingDto {
  @IsDateString()
  date!: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  time!: string;

  @IsString()
  lockToken!: string;

  @IsNumber()
  @Min(0)
  quotedTotal!: number;
}
