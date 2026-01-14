import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, MinLength, MaxLength } from "class-validator";

export class CreateTagDto {
  @ApiProperty({
    description: "Tag name",
    example: "React",
    minLength: 1,
    maxLength: 50,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  name: string;

  @ApiProperty({
    description: "URL-friendly slug (auto-generated if not provided)",
    example: "react",
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  slug?: string;
}
