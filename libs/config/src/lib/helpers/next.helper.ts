import { webConfig } from "../config";

/**
 * Helper to get validated Next.js configuration
 * Use this in your Next.js application instead of process.env
 */
export const getNextConfig = () => webConfig;

/**
 * Helper to check if running on client side
 */
export const isClient = () => typeof window !== "undefined";

/**
 * Helper to check if running on server side
 */
export const isServer = () => typeof window === "undefined";

/**
 * Helper to get API URL
 */
export const getApiUrl = () => webConfig.NEXT_PUBLIC_API_URL;

/**
 * Helper to get site URL
 */
export const getSiteUrl = () => webConfig.NEXT_PUBLIC_SITE_URL;

/**
 * Helper to get server port
 */
export const getPort = () => webConfig.NEXT_PORT;

/**
 * Helper to get server host
 */
export const getHost = () => webConfig.NEXT_HOST;
