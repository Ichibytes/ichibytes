import { z } from "zod";
import { baseEnvSchema } from "./base.schema";

/**
 * Web (Next.js) environment configuration schema
 * Only includes NEXT_PUBLIC_ variables that are exposed to the browser
 */
export const webEnvSchema = baseEnvSchema.extend({
  // Server Configuration (for Next.js dev server)
  NEXT_PORT: z.coerce.number().int().positive().default(3001),
  NEXT_HOST: z.string().default("localhost"),

  // Public variables (exposed to browser)
  NEXT_PUBLIC_API_URL: z.string().url().default("http://localhost:3000/api/v1"),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3001"),

  // Analytics (Optional)
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional(),
  NEXT_PUBLIC_PLAUSIBLE_DOMAIN: z.string().optional(),
});

export type WebEnv = z.infer<typeof webEnvSchema>;

/**
 * Validates and returns the Web environment configuration
 */
export function validateWebEnv(): WebEnv {
  try {
    return webEnvSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues
        .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
        .join("\n");
      throw new Error(
        `Invalid Web environment configuration:\n${issues}\n\nPlease check your .env file.`
      );
    }
    throw error;
  }
}
