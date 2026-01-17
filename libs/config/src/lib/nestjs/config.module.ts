import { Module, Global } from "@nestjs/common";
import { ConfigModule as NestConfigModule } from "@nestjs/config";
import { validateApiEnv } from "../schemas/api.schema";

/**
 * Global NestJS configuration module
 * Validates environment variables at application startup
 */
@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate: validateApiEnv,
      validationOptions: {
        allowUnknown: true, // Allow unknown env vars (for system variables)
        abortEarly: false, // Show all validation errors
      },
    }),
  ],
  exports: [NestConfigModule],
})
export class IchibytesConfigModule {}
