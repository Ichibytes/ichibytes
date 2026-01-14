import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsBoolean, IsArray, IsString } from "class-validator";
import { PaginationDto } from "../../core/dto/pagination.dto";

export class ProjectQueryDto extends PaginationDto {
  @ApiProperty({
    description: "Filter featured projects only",
    example: true,
    required: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  featured?: boolean;

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
    description: "Search in title and description",
    example: "react",
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;
}
