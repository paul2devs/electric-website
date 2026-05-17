import { IsOptional, IsUUID } from "class-validator";

export class AdminAssignTechnicianDto {
  @IsUUID()
  bookingId!: string;

  @IsUUID()
  @IsOptional()
  technicianId?: string;
}
