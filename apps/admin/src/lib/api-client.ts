/**
 * API Client configuration for the Admin application
 */
import { config, debugLog } from "./config";

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
 * Helper to fetch from API with authentication
 */
export const fetchApi = async <T = unknown>(
  path: string,
  options?: RequestInit & { token?: string }
): Promise<T> => {
  const url = buildApiUrl(path);
  const { token, ...fetchOptions } = options || {};

  debugLog(`Fetching: ${url}`);

  const headers: Record<string, string> = {
    ...apiClient.headers,
    ...(fetchOptions?.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    debugLog(`API request failed: ${response.statusText}`);
    throw new Error(`API request failed: ${response.statusText}`);
  }

  const data = await response.json();
  debugLog(`Response:`, data);

  return data;
};

/**
 * Helper to get authentication token from storage
 */
export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
};

/**
 * Helper to set authentication token
 */
export const setAuthToken = (token: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("auth_token", token);
};

/**
 * Helper to remove authentication token
 */
export const removeAuthToken = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("auth_token");
};

/**
 * Helper to fetch with authentication
 */
export const fetchAuthApi = async <T = unknown>(
  path: string,
  options?: RequestInit
): Promise<T> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error("No authentication token found");
  }

  return fetchApi<T>(path, { ...options, token });
};
