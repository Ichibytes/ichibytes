import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, MinLength } from "class-validator";

export class GenerateUploadUrlDto {
  @ApiProperty({
    description: "Original filename",
    example: "image.jpg",
  })
  @IsString()
  @MinLength(1)
  filename: string;

  @ApiProperty({
    description: "MIME type of the file",
    example: "image/jpeg",
  })
  @IsString()
  contentType: string;
}
