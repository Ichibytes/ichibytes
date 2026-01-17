import { z } from "zod";

/**
 * Base environment schema shared across all applications
 */
export const baseEnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

export type BaseEnv = z.infer<typeof baseEnvSchema>;
