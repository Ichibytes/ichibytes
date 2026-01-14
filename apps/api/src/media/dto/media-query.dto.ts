import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsInt, Min } from "class-validator";
import { Type } from "class-transformer";
import { PaginationDto } from "../../core/dto/pagination.dto";

export class MediaQueryDto extends PaginationDto {
  @ApiProperty({
    description: "Search in filename",
    example: "image",
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: "Filter by MIME type",
    example: "image/jpeg",
    required: false,
  })
  @IsOptional()
  @IsString()
  mimeType?: string;

  @ApiProperty({
    description: "Filter by uploader user ID",
    example: "uuid",
    required: false,
  })
  @IsOptional()
  @IsString()
  uploadedBy?: string;
}
