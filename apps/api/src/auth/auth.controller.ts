import { Controller, Post, Body, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import {
  LoginResponseDto,
  RefreshTokenResponseDto,
} from "./dto/auth-response.dto";
import { Public } from "../core/decorators/public.decorator";
import {
  CurrentUser,
  CurrentUserPayload,
} from "../core/decorators/current-user.decorator";

@ApiTags("auth")
@Controller({
  path: "admin/auth",
  version: "1",
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("login")
  @Throttle({ short: { ttl: 60000, limit: 5 } }) // 5 attempts per minute for login
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Login",
    description:
      "Authenticate user with email and password. Returns access token and refresh token. Rate limited to 5 attempts per minute.",
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
  @ApiResponse({
    status: 429,
    description: "Too many login attempts. Please try again later.",
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

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Logout",
    description:
      "Logout the current user. Client should discard tokens. Note: JWT tokens are stateless and cannot be invalidated server-side without a token blacklist.",
  })
  @ApiResponse({
    status: 200,
    description: "Logout successful",
    schema: {
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        message: {
          type: "string",
          example: "Logged out successfully",
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
  })
  async logout(@CurrentUser() _user: CurrentUserPayload) {
    // Since we're using stateless JWT tokens, we can't invalidate them server-side
    // without implementing a token blacklist (e.g., using Redis or database)
    // For now, we just return success and the client should discard the tokens
    // In the future, you could implement token blacklisting here

    return {
      success: true,
      message: "Logged out successfully. Please discard your tokens.",
    };
  }
}
