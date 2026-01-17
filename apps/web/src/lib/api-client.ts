/**
 * API Client configuration for the Web application
 */
import { config } from "./config";

/**
 * API client configuration
 */
export const apiClient = {
  baseURL: config.apiUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
};

/**
 * Helper to build API URLs
 */
export const buildApiUrl = (path: string): string => {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${config.apiUrl}${cleanPath}`;
};

/**
 * Helper to fetch from API
 */
export const fetchApi = async <T = unknown>(
  path: string,
  options?: RequestInit
): Promise<T> => {
  const url = buildApiUrl(path);
  const response = await fetch(url, {
    ...options,
    headers: {
      ...apiClient.headers,
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
};
