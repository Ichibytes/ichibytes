import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface ApiResponse<T = unknown> {
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
    hasNext?: boolean;
    hasPrev?: boolean;
  };
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: string[];
}

export class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;
  private refreshToken: string | null = null;
  private onTokenRefresh?: (token: string) => void;

  constructor(config: ApiClientConfig) {
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 30000,
      headers: {
        "Content-Type": "application/json",
        ...config.headers,
      },
    });

    this.setupInterceptors();
  }

  setToken(token: string): void {
    this.token = token;
  }

  setRefreshToken(refreshToken: string): void {
    this.refreshToken = refreshToken;
  }

  setOnTokenRefresh(callback: (token: string) => void): void {
    this.onTokenRefresh = callback;
  }

  clearTokens(): void {
    this.token = null;
    this.refreshToken = null;
  }

  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };

        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          this.refreshToken
        ) {
          originalRequest._retry = true;

          try {
            const newToken = await this.refreshAccessToken();
            if (newToken && originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            this.clearTokens();
            if (this.onTokenRefresh) {
              this.onTokenRefresh("");
            }
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(this.handleError(error));
      }
    );
  }

  private async refreshAccessToken(): Promise<string | null> {
    if (!this.refreshToken) {
      return null;
    }

    try {
      const response = await axios.post<{ accessToken: string }>(
        `${this.client.defaults.baseURL}/admin/auth/refresh`,
        {
          refreshToken: this.refreshToken,
        }
      );

      const newToken = response.data.accessToken;
      this.setToken(newToken);

      if (this.onTokenRefresh) {
        this.onTokenRefresh(newToken);
      }

      return newToken;
    } catch (error) {
      this.clearTokens();
      throw error;
    }
  }

  private handleError(error: AxiosError): ApiError {
    if (error.response) {
      const response = error.response;
      const data = response.data as {
        message?: string | string[];
        error?: string;
      };

      return {
        message:
          typeof data.message === "string"
            ? data.message
            : Array.isArray(data.message)
              ? data.message[0]
              : data.error || "An error occurred",
        statusCode: response.status,
        errors: Array.isArray(data.message) ? data.message : undefined,
      };
    }

    if (error.request) {
      return {
        message: "Network error. Please check your connection.",
        statusCode: 0,
      };
    }

    return {
      message: error.message || "An unexpected error occurred",
      statusCode: 0,
    };
  }

  async get<T = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.client.get<T>(url, config);
    return {
      data: response.data as T,
    };
  }

  async post<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.client.post<T>(url, data, config);
    const responseData = response.data as unknown;

    if (
      responseData &&
      typeof responseData === "object" &&
      responseData !== null &&
      "data" in responseData &&
      "meta" in responseData
    ) {
      return responseData as ApiResponse<T>;
    }

    return {
      data: responseData as T,
    };
  }

  async patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.client.patch<T>(url, data, config);
    const responseData = response.data as unknown;

    if (
      responseData &&
      typeof responseData === "object" &&
      responseData !== null &&
      "data" in responseData &&
      "meta" in responseData
    ) {
      return responseData as ApiResponse<T>;
    }

    return {
      data: responseData as T,
    };
  }

  async put<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.client.put<T>(url, data, config);
    const responseData = response.data as unknown;

    if (
      responseData &&
      typeof responseData === "object" &&
      responseData !== null &&
      "data" in responseData &&
      "meta" in responseData
    ) {
      return responseData as ApiResponse<T>;
    }

    return {
      data: responseData as T,
    };
  }

  async delete<T = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.client.delete<T>(url, config);
    const responseData = response.data as any;

    if (
      responseData &&
      typeof responseData === "object" &&
      "data" in responseData &&
      "meta" in responseData
    ) {
      return responseData as ApiResponse<T>;
    }

    return {
      data: responseData as T,
    };
  }

  async upload<T = unknown>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await this.client.post<T>(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    });

    const responseData = response.data as unknown;

    if (
      responseData &&
      typeof responseData === "object" &&
      responseData !== null &&
      "data" in responseData &&
      "meta" in responseData
    ) {
      return responseData as ApiResponse<T>;
    }

    return {
      data: responseData as T,
    };
  }
}

export function createApiClient(config: ApiClientConfig): ApiClient {
  return new ApiClient(config);
}
