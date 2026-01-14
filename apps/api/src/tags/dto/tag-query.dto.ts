import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { PaginationDto } from "../../core/dto/pagination.dto";

export class TagQueryDto extends PaginationDto {
  @ApiProperty({
    description: "Search in tag names",
    example: "react",
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;
}
