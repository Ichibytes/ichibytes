import { LoggerService } from "@nestjs/common";
import { apiConfig } from "@ichibytes/config";

/**
 * Structured log entry interface
 */
export interface StructuredLog {
  timestamp: string;
  level: string;
  context: string;
  message: string;
  [key: string]: unknown;
}

/**
 * Creates a structured log entry
 */
export function createStructuredLog(
  level: string,
  context: string,
  message: string,
  metadata?: Record<string, unknown>
): StructuredLog {
  return {
    timestamp: new Date().toISOString(),
    level,
    context,
    message,
    ...metadata,
  };
}

/**
 * Formats log entry based on environment
 */
export function formatLogEntry(
  log: StructuredLog,
  isProduction: boolean
): string {
  if (isProduction) {
    return JSON.stringify(log);
  }
  // Development format: readable string
  const metadataStr = Object.keys(log)
    .filter(
      (key) => !["timestamp", "level", "context", "message"].includes(key)
    )
    .map((key) => `${key}=${JSON.stringify(log[key])}`)
    .join(" ");

  return `[${log.timestamp}] ${log.level.toUpperCase()} [${log.context}] ${log.message}${metadataStr ? ` ${metadataStr}` : ""}`;
}

/**
 * Gets log levels based on environment
 */
export function getLogLevels(): (
  | "error"
  | "warn"
  | "log"
  | "debug"
  | "verbose"
)[] {
  const logLevel = apiConfig.LOG_LEVEL.toLowerCase();

  const levels = ["error", "warn", "log", "debug", "verbose"];
  const index = levels.indexOf(logLevel);
  if (index !== -1) {
    return levels.slice(0, index + 1) as (
      | "error"
      | "warn"
      | "log"
      | "debug"
      | "verbose"
    )[];
  }

  // Default levels per environment
  if (apiConfig.NODE_ENV === "production") {
    return ["error", "warn", "log"];
  }

  return ["error", "warn", "log", "debug", "verbose"];
}
