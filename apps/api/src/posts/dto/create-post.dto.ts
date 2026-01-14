import { ApiProperty } from "@nestjs/swagger";
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

export class CreatePostDto {
  @ApiProperty({
    description: "Post title",
    example: "My First Blog Post",
    minLength: 1,
    maxLength: 200,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title: string;

  @ApiProperty({
    description: "URL-friendly slug (auto-generated if not provided)",
    example: "my-first-blog-post",
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  slug?: string;

  @ApiProperty({
    description: "Post content in Markdown format",
    example: "# Introduction\n\nThis is my first blog post...",
  })
  @IsString()
  @MinLength(1)
  content: string;

  @ApiProperty({
    description: "Short excerpt/summary of the post",
    example: "A brief summary of the blog post content...",
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  excerpt?: string;

  @ApiProperty({
    description: "Post status",
    enum: PostStatus,
    example: PostStatus.DRAFT,
    default: PostStatus.DRAFT,
    required: false,
  })
  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus = PostStatus.DRAFT;

  @ApiProperty({
    description: "Array of tag IDs to associate with the post",
    example: ["uuid1", "uuid2"],
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tagIds?: string[];

  @ApiProperty({
    description: "Scheduled publish date (ISO 8601)",
    example: "2025-01-20T10:00:00Z",
    required: false,
  })
  @IsOptional()
  @IsDateString()
  scheduledAt?: string;
}
