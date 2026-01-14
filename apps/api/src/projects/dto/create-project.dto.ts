import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  IsArray,
  IsObject,
  MinLength,
  MaxLength,
  Min,
} from "class-validator";

export class ProjectLinksDto {
  @ApiProperty({
    description: "GitHub repository URL",
    example: "https://github.com/user/repo",
    required: false,
  })
  @IsOptional()
  @IsString()
  github?: string;

  @ApiProperty({
    description: "Live demo URL",
    example: "https://demo.example.com",
    required: false,
  })
  @IsOptional()
  @IsString()
  demo?: string;

  @ApiProperty({
    description: "Documentation URL",
    example: "https://docs.example.com",
    required: false,
  })
  @IsOptional()
  @IsString()
  docs?: string;
}

export class CreateProjectDto {
  @ApiProperty({
    description: "Project title",
    example: "Awesome Project",
    minLength: 1,
    maxLength: 200,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title: string;

  @ApiProperty({
    description: "URL-friendly slug (auto-generated if not provided)",
    example: "awesome-project",
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  slug?: string;

  @ApiProperty({
    description: "Project description in Markdown format",
    example: "This is an awesome project that does amazing things...",
  })
  @IsString()
  @MinLength(1)
  description: string;

  @ApiProperty({
    description: "Whether the project is featured",
    example: false,
    default: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  featured?: boolean = false;

  @ApiProperty({
    description: "Display order (lower numbers appear first)",
    example: 0,
    default: 0,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  order?: number = 0;

  @ApiProperty({
    description: "Array of technology names",
    example: ["React", "TypeScript", "Node.js"],
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  techStack?: string[];

  @ApiProperty({
    description: "Project links (GitHub, demo, etc.)",
    type: ProjectLinksDto,
    required: false,
  })
  @IsOptional()
  @IsObject()
  links?: ProjectLinksDto;

  @ApiProperty({
    description: "Array of tag IDs to associate with the project",
    example: ["uuid1", "uuid2"],
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tagIds?: string[];

  @ApiProperty({
    description: "Array of media IDs for project images",
    example: ["uuid1", "uuid2"],
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageIds?: string[];
}
