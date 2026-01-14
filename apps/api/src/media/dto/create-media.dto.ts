import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsInt, Min, Max } from "class-validator";

export class CreateMediaDto {
  @ApiProperty({
    description: "Original filename",
    example: "image.jpg",
  })
  @IsString()
  filename: string;

  @ApiProperty({
    description: "URL where the media is stored",
    example: "https://cdn.example.com/media/image.jpg",
  })
  @IsString()
  url: string;

  @ApiProperty({
    description: "MIME type of the file",
    example: "image/jpeg",
  })
  @IsString()
  mimeType: string;

  @ApiProperty({
    description: "File size in bytes",
    example: 1024000,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  size: number;
}
