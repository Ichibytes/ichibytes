import { z } from "zod";
import { baseEnvSchema } from "./base.schema";

/**
 * API (NestJS) environment configuration schema
 */
export const apiEnvSchema = baseEnvSchema.extend({
  // Server Configuration
  PORT: z.coerce.number().int().positive().default(3000),
  HOST: z.string().default("0.0.0.0"),

  // Database Configuration
  DATABASE_URL: z.string().url().describe("PostgreSQL connection string"),

  // JWT Configuration
  JWT_SECRET: z
    .string()
    .min(32)
    .describe("JWT signing secret (minimum 32 characters)"),
  JWT_EXPIRES_IN: z.string().default("15m").describe("JWT expiration time"),
  JWT_REFRESH_EXPIRES_IN: z
    .string()
    .default("7d")
    .describe("Refresh token expiration time"),

  // CORS Configuration
  ADMIN_URL: z.string().url().default("http://localhost:4200"),
  WEB_URL: z.string().url().default("http://localhost:3000"),

  // S3/MinIO Configuration (Optional)
  S3_ACCESS_KEY_ID: z.string().optional(),
  S3_SECRET_ACCESS_KEY: z.string().optional(),
  S3_ENDPOINT: z.string().url().optional(),
  S3_BUCKET: z.string().default("ichibytes-media"),
  S3_REGION: z.string().default("us-east-1"),
  S3_BASE_URL: z.string().url().optional(),

  // Email Configuration (Optional - for future use)
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().positive().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  SMTP_FROM: z.string().email().optional(),

  // Rate Limiting
  THROTTLE_TTL: z.coerce.number().int().positive().default(60000),
  THROTTLE_LIMIT: z.coerce.number().int().positive().default(100),

  // Logging
  LOG_LEVEL: z
    .enum(["error", "warn", "log", "debug", "verbose"])
    .default("log"),
});

export type ApiEnv = z.infer<typeof apiEnvSchema>;

/**
 * Validates and returns the API environment configuration
 */
export function validateApiEnv(): ApiEnv {
  try {
    return apiEnvSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues
        .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
        .join("\n");
      throw new Error(
        `Invalid API environment configuration:\n${issues}\n\nPlease check your .env file.`
      );
    }
    throw error;
  }
}
