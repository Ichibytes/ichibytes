import {
  Controller,
  Post,
  Body,
  Version,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import {
  LoginResponseDto,
  RefreshTokenResponseDto,
} from "./dto/auth-response.dto";
import { Public } from "../core/decorators/public.decorator";

@ApiTags("auth")
@Controller({
  path: "admin/auth",
  version: "1",
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Login",
    description:
      "Authenticate user with email and password. Returns access token and refresh token.",
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: "Login successful",
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: "Invalid credentials",
  })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    const result = await this.authService.login(loginDto);
    return {
      ...result,
      expiresIn: 900, // 15 minutes in seconds
    };
  }

  @Public()
  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Refresh token",
    description: "Get a new access token using a valid refresh token.",
  })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({
    status: 200,
    description: "Token refreshed successfully",
    type: RefreshTokenResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Invalid refresh token",
  })
  async refresh(
    @Body() refreshTokenDto: RefreshTokenDto
  ): Promise<RefreshTokenResponseDto> {
    const result = await this.authService.refreshToken(
      refreshTokenDto.refreshToken
    );
    return {
      ...result,
      expiresIn: 900, // 15 minutes in seconds
    };
  }
}
