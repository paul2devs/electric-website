import { IsDateString, IsString, IsUUID, Matches } from "class-validator";

export class UnlockSlotDto {
  @IsUUID()
  serviceId!: string;

  @IsDateString()
  date!: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  time!: string;

  @IsString()
  lockToken!: string;
}
