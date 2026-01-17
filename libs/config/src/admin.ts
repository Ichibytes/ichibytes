/**
 * Admin-specific exports (React/Vite)
 * This file only exports what's needed for React/Vite applications
 */

// Schemas
export * from "./lib/schemas/base.schema";
export * from "./lib/schemas/admin.schema";

// Admin configuration only
export { adminConfig } from "./lib/config";
export { isProduction, isDevelopment, isTest } from "./lib/config";

// Vite helpers
export {
  getViteConfig,
  getApiUrl,
  getSiteUrl,
  isDebugEnabled,
  getPort,
  getHost,
} from "./lib/helpers/vite.helper";
