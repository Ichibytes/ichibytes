import { ApiProperty, PartialType } from "@nestjs/swagger";
import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsDateString,
  MinLength,
  MaxLength,
} from "class-validator";
import { PostStatus } from "@prisma/client";
import { CreatePostDto } from "./create-post.dto";

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @ApiProperty({
    description: "Post title",
    example: "Updated Blog Post Title",
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title?: string;

  @ApiProperty({
    description: "URL-friendly slug",
    example: "updated-blog-post",
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  slug?: string;

  @ApiProperty({
    description: "Post content in Markdown format",
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  content?: string;

  @ApiProperty({
    description: "Short excerpt/summary",
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  excerpt?: string;

  @ApiProperty({
    description: "Post status",
    enum: PostStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus;

  @ApiProperty({
    description: "Array of tag IDs",
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tagIds?: string[];

  @ApiProperty({
    description: "Scheduled publish date (ISO 8601)",
    required: false,
  })
  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @ApiProperty({
    description:
      "Expected updatedAt timestamp for optimistic concurrency control (ISO 8601). If provided, update will fail if post has been modified.",
    example: "2025-01-14T10:00:00.000Z",
    required: false,
  })
  @IsOptional()
  @IsDateString()
  expectedUpdatedAt?: string;
}
