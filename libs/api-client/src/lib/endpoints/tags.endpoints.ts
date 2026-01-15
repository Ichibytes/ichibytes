import { ApiClient, ApiResponse } from "../api-client";

export interface Tag {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    posts: number;
    projects: number;
  };
}

export interface CreateTagRequest {
  name: string;
}

export interface UpdateTagRequest {
  name?: string;
}

export interface TagQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export class TagsEndpoints {
  constructor(private client: ApiClient) {}

  async list(params?: TagQueryParams): Promise<ApiResponse<Tag[]>> {
    return this.client.get<Tag[]>("/admin/tags", { params });
  }

  async getById(id: string): Promise<ApiResponse<Tag>> {
    return this.client.get<Tag>(`/admin/tags/${id}`);
  }

  async create(data: CreateTagRequest): Promise<ApiResponse<Tag>> {
    return this.client.post<Tag>("/admin/tags", data);
  }

  async update(id: string, data: UpdateTagRequest): Promise<ApiResponse<Tag>> {
    return this.client.patch<Tag>(`/admin/tags/${id}`, data);
  }

  async delete(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.client.delete<{ message: string }>(`/admin/tags/${id}`);
  }
}
