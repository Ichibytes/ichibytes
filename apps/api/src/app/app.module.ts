import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaModule } from "database";
import { LoggerMiddleware } from "../core/middleware/logger.middleware";
import { PublicModule } from "../public/public.module";
import { AdminModule } from "../admin/admin.module";
import { HealthModule } from "../health/health.module";
import { AuthModule } from "../auth/auth.module";
import { JwtAuthGuard } from "../core/guards/jwt-auth.guard";
import { RolesGuard } from "../core/guards/roles.guard";

@Module({
  imports: [PrismaModule, PublicModule, AdminModule, HealthModule, AuthModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("{*splat}");
  }
}
