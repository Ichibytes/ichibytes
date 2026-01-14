import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaModule } from "database";
import { LoggerMiddleware } from "../core/middleware/logger.middleware";
import { PublicModule } from "../public/public.module";
import { AdminModule } from "../admin/admin.module";
import { HealthModule } from "../health/health.module";

@Module({
  imports: [PrismaModule, PublicModule, AdminModule, HealthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("{*splat}");
  }
}
