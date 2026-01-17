import { adminConfig } from "../config";

/**
 * Helper to get validated Vite/React configuration
 * Use this in your React/Vite application instead of import.meta.env
 */
export const getViteConfig = () => adminConfig;

/**
 * Helper to get API URL
 */
export const getApiUrl = () => adminConfig.VITE_API_URL;

/**
 * Helper to get site URL
 */
export const getSiteUrl = () => adminConfig.VITE_SITE_URL;

/**
 * Helper to check if debug mode is enabled
 */
export const isDebugEnabled = () => adminConfig.VITE_ENABLE_DEBUG;

/**
 * Helper to get server port
 */
export const getPort = () => adminConfig.VITE_PORT;

/**
 * Helper to get server host
 */
export const getHost = () => adminConfig.VITE_HOST;
