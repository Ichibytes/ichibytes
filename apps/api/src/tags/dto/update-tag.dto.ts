import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsString, IsOptional, MinLength, MaxLength } from "class-validator";
import { CreateTagDto } from "./create-tag.dto";

export class UpdateTagDto extends PartialType(CreateTagDto) {
  @ApiProperty({
    description: "Tag name",
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  name?: string;

  @ApiProperty({
    description: "URL-friendly slug",
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  slug?: string;
}
