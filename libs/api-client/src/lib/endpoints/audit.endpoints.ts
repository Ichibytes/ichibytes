import { ApiClient, ApiResponse } from "../api-client";

export interface AuditLog {
  id: string;
  userId: string | null;
  user: {
    id: string;
    email: string;
    name: string | null;
    role: string;
  } | null;
  action: string;
  resourceType: string;
  resourceId: string | null;
  changes: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}

export interface AuditLogQueryParams {
  page?: number;
  limit?: number;
  userId?: string;
  action?: string;
  resourceType?: string;
  resourceId?: string;
  startDate?: string;
  endDate?: string;
}

export class AuditEndpoints {
  constructor(private client: ApiClient) {}

  async list(params?: AuditLogQueryParams): Promise<ApiResponse<AuditLog[]>> {
    return this.client.get<AuditLog[]>("/admin/audit-logs", { params });
  }

  async getByResource(
    resourceType: string,
    resourceId: string,
    params?: { page?: number; limit?: number }
  ): Promise<ApiResponse<AuditLog[]>> {
    return this.client.get<AuditLog[]>(
      `/admin/audit-logs/resource/${resourceType}/${resourceId}`,
      { params }
    );
  }

  async getByUser(
    userId: string,
    params?: { page?: number; limit?: number }
  ): Promise<ApiResponse<AuditLog[]>> {
    return this.client.get<AuditLog[]>(`/admin/audit-logs/user/${userId}`, {
      params,
    });
  }
}
