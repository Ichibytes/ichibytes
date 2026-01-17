// Schemas
export * from "./lib/schemas/base.schema";
export * from "./lib/schemas/api.schema";
export * from "./lib/schemas/web.schema";
export * from "./lib/schemas/admin.schema";

// NestJS Module (only for API)
export * from "./lib/nestjs/config.module";

// Validated configurations - export selectively
export { webConfig, adminConfig, apiConfig } from "./lib/config";
export { isProduction, isDevelopment, isTest } from "./lib/config";

// Helpers - export individually to avoid conflicts
export {
  getNextConfig,
  isClient,
  isServer,
  getApiUrl as getNextApiUrl,
  getSiteUrl,
} from "./lib/helpers/next.helper";

export {
  getViteConfig,
  getApiUrl as getViteApiUrl,
  isDebugEnabled,
  getPort,
  getHost,
} from "./lib/helpers/vite.helper";
