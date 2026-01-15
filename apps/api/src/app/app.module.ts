import { Module } from "@nestjs/common";
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { ThrottlerModule } from "@nestjs/throttler";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaModule } from "database";
import { LoggingInterceptor } from "../core/interceptors/logging.interceptor";
import { PublicModule } from "../public/public.module";
import { AdminModule } from "../admin/admin.module";
import { HealthModule } from "../health/health.module";
import { AuthModule } from "../auth/auth.module";
import { PostsModule } from "../posts/posts.module";
import { MediaModule } from "../media/media.module";
import { ProjectsModule } from "../projects/projects.module";
import { ContactModule } from "../contact/contact.module";
import { JwtAuthGuard } from "../core/guards/jwt-auth.guard";
import { RolesGuard } from "../core/guards/roles.guard";
import { CustomThrottleGuard } from "../core/guards/throttle.guard";
import { SanitizePipe } from "../core/pipes/sanitize.pipe";
import { MetricsController } from "../core/controllers/metrics.controller";

@Module({
  imports: [
    PrismaModule,
    ThrottlerModule.forRoot([
      {
        name: "short",
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute (public endpoints)
      },
      {
        name: "medium",
        ttl: 600000, // 10 minutes
        limit: 200, // 200 requests per 10 minutes (public endpoints)
      },
      {
        name: "long",
        ttl: 3600000, // 1 hour
        limit: 1000, // 1000 requests per hour (public endpoints)
      },
    ]),
    PublicModule,
    AdminModule,
    HealthModule,
    AuthModule,
    PostsModule,
    MediaModule,
    ProjectsModule,
    ContactModule,
  ],
  controllers: [AppController, MetricsController],
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
    {
      provide: APP_GUARD,
      useClass: CustomThrottleGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_PIPE,
      useClass: SanitizePipe,
    },
  ],
})
export class AppModule {}
