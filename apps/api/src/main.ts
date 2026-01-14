import { Logger, ValidationPipe, VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app/app.module";
import { HttpExceptionFilter } from "./core/filters/http-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ["error", "warn", "log", "debug", "verbose"],
  });

  // Global prefix
  const globalPrefix = "api";
  app.setGlobalPrefix(globalPrefix);

  // API Versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: "v1",
    prefix: "v",
  });

  // CORS Configuration
  const allowedOrigins = [
    process.env.ADMIN_URL || "http://localhost:4200",
    process.env.WEB_URL || "http://localhost:3000",
  ].filter(Boolean);

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],
    exposedHeaders: ["X-Total-Count", "X-Page", "X-Per-Page"],
  });

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that don't have decorators
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
      transform: true, // Automatically transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Enable implicit type conversion
      },
      disableErrorMessages: process.env.NODE_ENV === "production", // Disable detailed error messages in production
    })
  );

  // Global Exception Filter
  app.useGlobalFilters(new HttpExceptionFilter());

  const port = process.env.PORT || 3000;
  await app.listen(port);

  const logger = new Logger("Bootstrap");
  logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
  logger.log(`📚 API Version: v1`);
  logger.log(`🌍 CORS enabled for: ${allowedOrigins.join(", ")}`);
  logger.log(`🔧 Environment: ${process.env.NODE_ENV || "development"}`);
}

bootstrap();
