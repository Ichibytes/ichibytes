import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { Request, Response } from "express";
import { createStructuredLog, formatLogEntry } from "../utils/logger.util";
import { metricsCollector } from "../utils/metrics.util";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger("HTTP");
  private readonly isProduction = process.env.NODE_ENV === "production";

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { method, originalUrl, ip, body, query, params } = request;
    const userAgent = request.get("user-agent") || "";
    const startTime = Date.now();

    // Skip logging for health checks in production
    if (this.isProduction && originalUrl.includes("/health")) {
      return next.handle();
    }

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          const { statusCode } = response;
          const contentLength = response.get("content-length");

          // Record metrics
          metricsCollector.increment("http_request", {
            statusCode: statusCode.toString(),
            method,
            endpoint: originalUrl,
          });
          metricsCollector.histogram("http_response_time", duration, {
            endpoint: originalUrl,
            method,
          });

          const logEntry = createStructuredLog(
            this.getLogLevel(statusCode),
            "HTTP",
            `${method} ${originalUrl} ${statusCode}`,
            {
              duration: `${duration}ms`,
              ip,
              userAgent,
              ...(contentLength && { contentLength }),
              ...(query &&
                typeof query === "object" &&
                Object.keys(query).length > 0 && { query }),
              ...(params &&
                typeof params === "object" &&
                Object.keys(params).length > 0 && { params }),
              // Only log body for non-sensitive endpoints
              ...(this.shouldLogBody(originalUrl) &&
                body &&
                typeof body === "object" &&
                Object.keys(body).length > 0 && {
                  body: this.sanitizeBody(body),
                }),
            }
          );

          const formattedLog = formatLogEntry(logEntry, this.isProduction);
          this.logger[this.getLogLevel(statusCode)](formattedLog);
        },
        error: (error) => {
          // Record error metric (error logging is handled by HttpExceptionFilter)
          metricsCollector.increment("http_error", {
            endpoint: originalUrl,
            method,
            type: "interceptor",
          });
          // Re-throw error so HttpExceptionFilter can handle logging
          throw error;
        },
      })
    );
  }

  private getLogLevel(statusCode: number): "error" | "warn" | "log" {
    if (statusCode >= 500) {
      return "error";
    }
    if (statusCode >= 400) {
      return "warn";
    }
    return "log";
  }

  private shouldLogBody(url: string): boolean {
    // Don't log body for sensitive endpoints
    const sensitivePaths = ["/auth/login", "/auth/refresh"];
    return !sensitivePaths.some((path) => url.includes(path));
  }

  private sanitizeBody(body: Record<string, unknown>): Record<string, unknown> {
    const sanitized = { ...body };
    // Remove sensitive fields
    const sensitiveFields = [
      "password",
      "token",
      "refreshToken",
      "accessToken",
    ];
    sensitiveFields.forEach((field) => {
      if (sanitized[field]) {
        sanitized[field] = "***REDACTED***";
      }
    });
    return sanitized;
  }
}
