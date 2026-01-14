import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class LoginDto {
  @ApiProperty({
    description: "User email address",
    example: "admin@example.com",
    type: String,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "User password (minimum 6 characters)",
    example: "password123",
    type: String,
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;
}
