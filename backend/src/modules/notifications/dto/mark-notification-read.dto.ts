import { IsBoolean } from "class-validator";

export class MarkNotificationReadDto {
  @IsBoolean()
  read!: boolean;
}
