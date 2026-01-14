import { ApiProperty, PartialType } from "@nestjs/swagger";
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
import { Type } from "class-transformer";
import { CreateProjectDto, ProjectLinksDto } from "./create-project.dto";

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  @ApiProperty({
    description: "Project title",
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title?: string;

  @ApiProperty({
    description: "URL-friendly slug",
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  slug?: string;

  @ApiProperty({
    description: "Project description",
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  description?: string;

  @ApiProperty({
    description: "Whether the project is featured",
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @ApiProperty({
    description: "Display order",
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  order?: number;

  @ApiProperty({
    description: "Array of technology names",
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  techStack?: string[];

  @ApiProperty({
    description: "Project links",
    type: ProjectLinksDto,
    required: false,
  })
  @IsOptional()
  @IsObject()
  links?: ProjectLinksDto;

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
    description: "Array of media IDs for project images",
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageIds?: string[];
}
