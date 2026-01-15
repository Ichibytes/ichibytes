import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsDateString } from "class-validator";
import { PaginationDto } from "../../core/dto/pagination.dto";

export class AuditLogQueryDto extends PaginationDto {
  @ApiProperty({
    description: "Filter by user ID",
    example: "uuid",
    required: false,
  })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({
    description: "Filter by action (create, update, delete, publish, etc.)",
    example: "create",
    required: false,
  })
  @IsOptional()
  @IsString()
  action?: string;

  @ApiProperty({
    description: "Filter by resource type (post, project, user, etc.)",
    example: "post",
    required: false,
  })
  @IsOptional()
  @IsString()
  resourceType?: string;

  @ApiProperty({
    description: "Filter by resource ID",
    example: "uuid",
    required: false,
  })
  @IsOptional()
  @IsString()
  resourceId?: string;

  @ApiProperty({
    description: "Filter by start date (ISO 8601)",
    example: "2025-01-01T00:00:00.000Z",
    required: false,
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({
    description: "Filter by end date (ISO 8601)",
    example: "2025-01-31T23:59:59.999Z",
    required: false,
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
