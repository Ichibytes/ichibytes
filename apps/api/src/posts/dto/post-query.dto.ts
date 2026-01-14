import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsOptional,
  IsEnum,
  IsArray,
  IsString,
  IsDateString,
} from "class-validator";
import { PostStatus } from "@prisma/client";
import { PaginationDto } from "../../core/dto/pagination.dto";

export class PostQueryDto extends PaginationDto {
  @ApiProperty({
    description: "Filter by post status",
    enum: PostStatus,
    required: false,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(PostStatus, { each: true })
  status?: PostStatus[];

  @ApiProperty({
    description: "Filter by tag IDs",
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tagIds?: string[];

  @ApiProperty({
    description: "Filter by author ID",
    example: "uuid",
    required: false,
  })
  @IsOptional()
  @IsString()
  authorId?: string;

  @ApiProperty({
    description: "Search in title and content",
    example: "react",
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: "Sort field",
    example: "publishedAt",
    enum: ["publishedAt", "createdAt", "updatedAt", "title"],
    required: false,
  })
  @IsOptional()
  @IsString()
  sort?: "publishedAt" | "createdAt" | "updatedAt" | "title";

  @ApiProperty({
    description: "Sort order",
    enum: ["asc", "desc"],
    example: "desc",
    default: "desc",
    required: false,
  })
  @IsOptional()
  @IsString()
  order?: "asc" | "desc" = "desc";

  @ApiProperty({
    description: "Filter by published date (from)",
    example: "2025-01-01T00:00:00Z",
    required: false,
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({
    description: "Filter by published date (to)",
    example: "2025-12-31T23:59:59Z",
    required: false,
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
