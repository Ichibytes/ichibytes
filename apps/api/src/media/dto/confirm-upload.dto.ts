import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsInt, Min } from "class-validator";

export class ConfirmUploadDto {
  @ApiProperty({
    description: "S3 key of the uploaded file",
    example: "media/1234567890-abc123-image.jpg",
  })
  @IsString()
  key: string;

  @ApiProperty({
    description: "Original filename",
    example: "image.jpg",
  })
  @IsString()
  filename: string;

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
