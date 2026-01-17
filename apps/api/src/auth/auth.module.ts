import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import type ms from "ms";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PrismaModule } from "database";
import { apiConfig } from "@ichibytes/config";
import { JwtStrategy } from "../core/strategies/jwt.strategy";

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: apiConfig.JWT_SECRET,
      signOptions: {
        expiresIn: apiConfig.JWT_EXPIRES_IN as ms.StringValue | number,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
