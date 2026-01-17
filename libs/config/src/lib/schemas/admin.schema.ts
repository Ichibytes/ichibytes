import { z } from "zod";
import { baseEnvSchema } from "./base.schema";

/**
 * Admin (React) environment configuration schema
 */
export const adminEnvSchema = baseEnvSchema.extend({
  // Server Configuration (for Vite dev server)
  VITE_PORT: z.coerce.number().int().positive().default(4200),
  VITE_HOST: z.string().default("localhost"),

  // Public variables (exposed to browser via Vite)
  VITE_API_URL: z.string().url().default("http://localhost:3000/api/v1"),
  VITE_SITE_URL: z.string().url().default("http://localhost:4200"),

  // Feature Flags
  VITE_ENABLE_DEBUG: z
    .enum(["true", "false"])
    .default("false")
    .transform((val) => val === "true"),
});

export type AdminEnv = z.infer<typeof adminEnvSchema>;

/**
 * Validates and returns the Admin environment configuration
 */
export function validateAdminEnv(): AdminEnv {
  try {
    // Use process.env for Node.js environments
    // Vite will replace import.meta.env at build time
    const env = typeof process !== "undefined" ? process.env : {};
    return adminEnvSchema.parse(env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues
        .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
        .join("\n");
      throw new Error(
        `Invalid Admin environment configuration:\n${issues}\n\nPlease check your .env file.`
      );
    }
    throw error;
  }
}
