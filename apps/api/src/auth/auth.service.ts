import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import type ms from "ms";
import { PrismaService } from "database";
import { apiConfig } from "@ichibytes/config";
import * as bcrypt from "bcrypt";
import { LoginDto } from "./dto/login.dto";
import { JwtPayload } from "../core/strategies/jwt.strategy";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const { passwordHash: _passwordHash, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto): Promise<{
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      email: string;
      role: string;
      name?: string;
    };
  }> {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: apiConfig.JWT_EXPIRES_IN as ms.StringValue | number,
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: apiConfig.JWT_REFRESH_EXPIRES_IN as ms.StringValue | number,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name || undefined,
      },
    };
  }

  async refreshToken(refreshToken: string): Promise<{
    accessToken: string;
  }> {
    try {
      const payload = this.jwtService.verify<JwtPayload>(refreshToken);

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: {
          id: true,
          email: true,
          role: true,
        },
      });

      if (!user) {
        throw new UnauthorizedException("User not found");
      }

      const newPayload: JwtPayload = {
        sub: user.id,
        email: user.email,
        role: user.role,
      };

      const newAccessToken = this.jwtService.sign(newPayload, {
        expiresIn: apiConfig.JWT_EXPIRES_IN as ms.StringValue | number,
      });

      return {
        accessToken: newAccessToken,
      };
    } catch (error) {
      throw new BadRequestException("Invalid refresh token");
    }
  }
}
