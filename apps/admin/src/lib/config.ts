/**
 * Centralized configuration for the Admin application
 * Uses @ichibytes/config for validated environment variables
 */
import {
  adminConfig,
  getApiUrl,
  getSiteUrl,
  isDebugEnabled,
  getPort,
  getHost,
  isDevelopment,
  isProduction,
} from "@ichibytes/config/admin";

/**
 * Site name (hardcoded)
 */
export const SITE_NAME = "Ichibytes Admin";

/**
 * Export validated configuration
 */
export const config = {
  // Environment
  env: adminConfig.NODE_ENV,
  isDevelopment: isDevelopment(),
  isProduction: isProduction(),

  // Server
  port: getPort(),
  host: getHost(),

  // API
  apiUrl: getApiUrl(),

  // Site
  siteUrl: getSiteUrl(),
  siteName: SITE_NAME,

  // Features
  debug: isDebugEnabled(),
} as const;

/**
 * Helper to log debug messages
 */
export const debugLog = (...args: unknown[]) => {
  if (config.debug) {
    console.log("[DEBUG]", ...args);
  }
};

/**
 * Export individual helpers for convenience
 */
export { getApiUrl, getSiteUrl, isDebugEnabled, getPort, getHost };
