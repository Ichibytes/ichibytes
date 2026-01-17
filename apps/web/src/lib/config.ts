/**
 * Centralized configuration for the Web application
 * Uses @ichibytes/config for validated environment variables
 */
import {
  webConfig,
  getApiUrl,
  getSiteUrl,
  getPort,
  getHost,
  isDevelopment,
  isProduction,
} from "@ichibytes/config/web";

/**
 * Site metadata (hardcoded)
 */
export const SITE_NAME = "Ichibytes";
export const SITE_DESCRIPTION = "Personal website and blog";

/**
 * Feature flags (hardcoded)
 */
export const FEATURES = {
  comments: false,
  newsletter: false,
} as const;

/**
 * Export validated configuration
 */
export const config = {
  // Environment
  env: webConfig.NODE_ENV,
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
  siteDescription: SITE_DESCRIPTION,

  // Analytics
  analytics: {
    googleAnalyticsId: webConfig.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    plausibleDomain: webConfig.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
  },

  // Features
  features: FEATURES,
} as const;

/**
 * Helper to check if analytics is enabled
 */
export const isAnalyticsEnabled = () => {
  return !!(
    config.analytics.googleAnalyticsId || config.analytics.plausibleDomain
  );
};

/**
 * Export individual helpers for convenience
 */
export { getApiUrl, getSiteUrl, getPort, getHost };
