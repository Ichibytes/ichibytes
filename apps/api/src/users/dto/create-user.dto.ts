import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsString,
  IsEnum,
  IsOptional,
  MinLength,
  MaxLength,
} from "class-validator";
import { UserRole } from "@prisma/client";

export class CreateUserDto {
  @ApiProperty({
    description: "User email address",
    example: "user@example.com",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "User password (minimum 6 characters)",
    example: "password123",
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: "User role",
    enum: UserRole,
    example: UserRole.EDITOR,
    default: UserRole.EDITOR,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole = UserRole.EDITOR;

  @ApiProperty({
    description: "User full name",
    example: "John Doe",
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;
}
