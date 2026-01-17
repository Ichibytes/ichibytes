import { validateApiEnv } from "./schemas/api.schema";
import { validateWebEnv } from "./schemas/web.schema";
import { validateAdminEnv } from "./schemas/admin.schema";

/**
 * Lazy-loaded API configuration
 * Only validates when accessed
 */
let _apiConfig: ReturnType<typeof validateApiEnv> | null = null;
export const apiConfig = new Proxy({} as ReturnType<typeof validateApiEnv>, {
  get(target, prop) {
    if (!_apiConfig) {
      _apiConfig = validateApiEnv();
    }
    return _apiConfig[prop as keyof typeof _apiConfig];
  },
});

/**
 * Lazy-loaded Web configuration
 * Only validates when accessed
 */
let _webConfig: ReturnType<typeof validateWebEnv> | null = null;
export const webConfig = new Proxy({} as ReturnType<typeof validateWebEnv>, {
  get(target, prop) {
    if (!_webConfig) {
      _webConfig = validateWebEnv();
    }
    return _webConfig[prop as keyof typeof _webConfig];
  },
});

/**
 * Lazy-loaded Admin configuration
 * Only validates when accessed
 */
let _adminConfig: ReturnType<typeof validateAdminEnv> | null = null;
export const adminConfig = new Proxy(
  {} as ReturnType<typeof validateAdminEnv>,
  {
    get(target, prop) {
      if (!_adminConfig) {
        _adminConfig = validateAdminEnv();
      }
      return _adminConfig[prop as keyof typeof _adminConfig];
    },
  }
);

/**
 * Helper to check if running in production
 */
export const isProduction = () => process.env["NODE_ENV"] === "production";

/**
 * Helper to check if running in development
 */
export const isDevelopment = () => process.env["NODE_ENV"] === "development";

/**
 * Helper to check if running in test
 */
export const isTest = () => process.env["NODE_ENV"] === "test";
