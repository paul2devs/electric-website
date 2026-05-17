import { IsEnum, IsOptional, IsUUID } from "class-validator";

import { BookingStatus } from "@prisma/client";

export class AdminUpdateBookingDto {
  @IsEnum(BookingStatus)
  @IsOptional()
  status?: BookingStatus;

  @IsUUID()
  @IsOptional()
  technicianId?: string;
}
