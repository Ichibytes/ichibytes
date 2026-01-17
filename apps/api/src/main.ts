import { Logger, ValidationPipe, VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app/app.module";
import { HttpExceptionFilter } from "./core/filters/http-exception.filter";
import { getLogLevels } from "./core/utils/logger.util";
import { apiConfig } from "@ichibytes/config";
import helmet from "helmet";

async function bootstrap() {
  const logLevels = getLogLevels();
  const logger = new Logger("Bootstrap");
  const app = await NestFactory.create(AppModule, {
    logger: logLevels,
  });

  // Security Headers (Helmet)
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
      crossOriginEmbedderPolicy: false,
    })
  );

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
  const allowedOrigins = [apiConfig.ADMIN_URL, apiConfig.WEB_URL].filter(
    Boolean
  );

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
      disableErrorMessages: apiConfig.NODE_ENV === "production", // Disable detailed error messages in production
    })
  );

  // Global Exception Filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger/OpenAPI Documentation
  if (apiConfig.NODE_ENV !== "production") {
    const config = new DocumentBuilder()
      .setTitle("Ichibytes API")
      .setDescription("API documentation for Ichibytes website")
      .setVersion("1.0")
      .addServer(`http://localhost:${apiConfig.PORT}`, "Development")
      .addServer("https://api.ichibytes.dev", "Production")
      .addBearerAuth(
        {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          name: "JWT",
          description: "Enter JWT token",
          in: "header",
        },
        "JWT-auth" // This name here is important for matching up with @ApiBearerAuth() in your controller!
      )
      .addTag("auth", "Authentication endpoints")
      .addTag("public", "Public endpoints")
      .addTag("admin", "Admin endpoints")
      .addTag("health", "Health check endpoints")
      .addTag("metrics", "Metrics endpoints")
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api/docs", app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
      jsonDocumentUrl: "api/docs-json",
    });

    logger.log(
      `Swagger documentation available at: http://localhost:${apiConfig.PORT}/api/docs`
    );
    logger.log(
      `OpenAPI JSON schema available at: http://localhost:${apiConfig.PORT}/api/docs-json`
    );
  }

  await app.listen(apiConfig.PORT, apiConfig.HOST);

  logger.log(
    `Application is running on: http://localhost:${apiConfig.PORT}/${globalPrefix}`
  );
  logger.log(`API Version: v1`);
  logger.log(`CORS enabled for: ${allowedOrigins.join(", ")}`);
  logger.log(`Environment: ${apiConfig.NODE_ENV}`);
}

bootstrap();
