import { ApiClient, ApiResponse } from "../api-client";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string | null;
    role: string;
  };
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export class AuthEndpoints {
  constructor(private client: ApiClient) {}

  async login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return this.client.post<LoginResponse>("/admin/auth/login", data);
  }

  async refreshToken(
    data: RefreshTokenRequest
  ): Promise<ApiResponse<RefreshTokenResponse>> {
    return this.client.post<RefreshTokenResponse>("/admin/auth/refresh", data);
  }

  async logout(): Promise<ApiResponse<{ message: string }>> {
    return this.client.post<{ message: string }>("/admin/auth/logout");
  }
}
