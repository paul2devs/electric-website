import { IsDateString, IsString, IsUUID } from "class-validator";

export class GetAvailabilityDto {
  @IsUUID()
  serviceId!: string;

  @IsString()
  @IsDateString()
  date!: string;
}
