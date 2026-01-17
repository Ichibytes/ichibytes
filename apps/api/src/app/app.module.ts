import { Module } from "@nestjs/common";
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { ThrottlerModule } from "@nestjs/throttler";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaModule } from "database";
import { IchibytesConfigModule, apiConfig } from "@ichibytes/config";
import { LoggingInterceptor } from "../core/interceptors/logging.interceptor";
import { PublicModule } from "../public/public.module";
import { AdminModule } from "../admin/admin.module";
import { HealthModule } from "../health/health.module";
import { AuthModule } from "../auth/auth.module";
import { PostsModule } from "../posts/posts.module";
import { MediaModule } from "../media/media.module";
import { ProjectsModule } from "../projects/projects.module";
import { ContactModule } from "../contact/contact.module";
import { TagsModule } from "../tags/tags.module";
import { AuditLogModule } from "../audit/audit-log.module";
import { JwtAuthGuard } from "../core/guards/jwt-auth.guard";
import { RolesGuard } from "../core/guards/roles.guard";
import { CustomThrottleGuard } from "../core/guards/throttle.guard";
import { SanitizePipe } from "../core/pipes/sanitize.pipe";
import { MetricsController } from "../core/controllers/metrics.controller";

@Module({
  imports: [
    IchibytesConfigModule,
    PrismaModule,
    ThrottlerModule.forRoot([
      {
        name: "short",
        ttl: apiConfig.THROTTLE_TTL, // Default: 60000ms (1 minute)
        limit: apiConfig.THROTTLE_LIMIT, // Default: 100 requests
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
    TagsModule,
    AuditLogModule,
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
