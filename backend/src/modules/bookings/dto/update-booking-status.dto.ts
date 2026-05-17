import { IsIn, IsString } from "class-validator";

import { bookingStatuses } from "../constants/booking-status";

export class UpdateBookingStatusDto {
  @IsString()
  @IsIn(bookingStatuses)
  status!: (typeof bookingStatuses)[number];
}
