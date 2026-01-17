import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Request, Response } from "express";
import { apiConfig } from "@ichibytes/config";
import { createStructuredLog, formatLogEntry } from "../utils/logger.util";
import { metricsCollector } from "../utils/metrics.util";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);
  private readonly isProduction = apiConfig.NODE_ENV === "production";

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "Internal server error";
    let errors: string[] | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === "string") {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === "object") {
        const responseObj = exceptionResponse as {
          message?: string | string[];
          error?: string;
        };
        message =
          typeof responseObj.message === "string"
            ? responseObj.message
            : responseObj.message?.[0] || responseObj.error || message;
        errors = Array.isArray(responseObj.message)
          ? responseObj.message
          : undefined;
      }

      // Record error metric
      metricsCollector.increment("http_error", {
        statusCode: status.toString(),
        endpoint: request.url,
        method: request.method,
      });

      // Log all errors with structured logging
      const logEntry = createStructuredLog(
        status >= HttpStatus.INTERNAL_SERVER_ERROR ? "error" : "warn",
        HttpExceptionFilter.name,
        `${request.method} ${request.url} - ${status} - ${message}`,
        {
          statusCode: status,
          method: request.method,
          url: request.url,
          ip: request.ip,
          userAgent: request.get("user-agent") || "",
          ...(errors && { errors }),
          ...(exception.stack &&
            status >= HttpStatus.INTERNAL_SERVER_ERROR && {
              stack: exception.stack,
            }),
        }
      );

      const formattedLog = formatLogEntry(logEntry, this.isProduction);
      if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
        this.logger.error(formattedLog);
      } else {
        this.logger.warn(formattedLog);
      }
    } else if (exception instanceof Error) {
      message = exception.message;

      // Record error metric
      metricsCollector.increment("http_error", {
        statusCode: status.toString(),
        endpoint: request.url,
        method: request.method,
        type: "unhandled",
      });

      // Log unhandled exceptions with structured logging
      const logEntry = createStructuredLog(
        "error",
        HttpExceptionFilter.name,
        `Unhandled exception: ${exception.message}`,
        {
          statusCode: status,
          method: request.method,
          url: request.url,
          ip: request.ip,
          userAgent: request.get("user-agent") || "",
          ...(exception.stack && { stack: exception.stack }),
        }
      );

      const formattedLog = formatLogEntry(logEntry, this.isProduction);
      this.logger.error(formattedLog);
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      ...(errors && { errors }),
    };

    response.status(status).json(errorResponse);
  }
}
