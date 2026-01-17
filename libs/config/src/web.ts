/**
 * Web-specific exports (Next.js)
 * This file only exports what's needed for Next.js applications
 */

// Schemas
export * from "./lib/schemas/base.schema";
export * from "./lib/schemas/web.schema";

// Web configuration only
export { webConfig } from "./lib/config";
export { isProduction, isDevelopment, isTest } from "./lib/config";

// Next.js helpers
export {
  getNextConfig,
  isClient,
  isServer,
  getApiUrl,
  getSiteUrl,
  getPort,
  getHost,
} from "./lib/helpers/next.helper";
