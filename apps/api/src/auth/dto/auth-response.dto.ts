import { ApiProperty } from "@nestjs/swagger";

export class UserResponseDto {
  @ApiProperty({ example: "uuid", description: "User ID" })
  id: string;

  @ApiProperty({ example: "admin@example.com", description: "User email" })
  email: string;

  @ApiProperty({
    example: "admin",
    description: "User role",
    enum: ["admin", "editor"],
  })
  role: string;

  @ApiProperty({
    example: "John Doe",
    description: "User name",
    required: false,
  })
  name?: string;
}

export class LoginResponseDto {
  @ApiProperty({
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    description: "JWT access token",
  })
  accessToken: string;

  @ApiProperty({
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    description: "JWT refresh token",
  })
  refreshToken: string;

  @ApiProperty({
    example: 900,
    description: "Access token expiration time in seconds",
  })
  expiresIn: number;

  @ApiProperty({ type: UserResponseDto, description: "User information" })
  user: UserResponseDto;
}

export class RefreshTokenResponseDto {
  @ApiProperty({
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    description: "New JWT access token",
  })
  accessToken: string;

  @ApiProperty({
    example: 900,
    description: "Access token expiration time in seconds",
  })
  expiresIn: number;
}
