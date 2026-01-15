import { ApiProperty } from "@nestjs/swagger";
import { IsDateString } from "class-validator";

export class SchedulePostDto {
  @ApiProperty({
    description: "Scheduled publish date (ISO 8601)",
    example: "2025-01-20T10:00:00Z",
  })
  @IsDateString()
  scheduledAt: string;
}
