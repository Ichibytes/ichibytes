import { ApiClient, ApiResponse } from "../api-client";

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  status: "DRAFT" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED";
  publishedAt: string | null;
  scheduledAt: string | null;
  authorId: string;
  author: {
    id: string;
    email: string;
    name: string | null;
  };
  tags: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  excerpt?: string;
  status?: "DRAFT" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED";
  tagIds?: string[];
  publishedAt?: string;
  scheduledAt?: string;
}

export interface UpdatePostRequest {
  title?: string;
  content?: string;
  excerpt?: string;
  status?: "DRAFT" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED";
  tagIds?: string[];
  publishedAt?: string;
  scheduledAt?: string;
  expectedUpdatedAt?: string;
}

export interface PostQueryParams {
  page?: number;
  limit?: number;
  status?: "DRAFT" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED";
  authorId?: string;
  search?: string;
  tagId?: string;
  sortBy?: "createdAt" | "updatedAt" | "publishedAt" | "title";
  sortOrder?: "asc" | "desc";
}

export interface SchedulePostRequest {
  scheduledAt: string;
}

export class PostsEndpoints {
  constructor(private client: ApiClient) {}

  async listPublic(params?: PostQueryParams): Promise<ApiResponse<Post[]>> {
    return this.client.get<Post[]>("/public/posts", { params });
  }

  async getPublicBySlug(slug: string): Promise<ApiResponse<Post>> {
    return this.client.get<Post>(`/public/posts/${slug}`);
  }

  async listAdmin(params?: PostQueryParams): Promise<ApiResponse<Post[]>> {
    return this.client.get<Post[]>("/admin/posts", { params });
  }

  async getAdminById(id: string): Promise<ApiResponse<Post>> {
    return this.client.get<Post>(`/admin/posts/${id}`);
  }

  async create(data: CreatePostRequest): Promise<ApiResponse<Post>> {
    return this.client.post<Post>("/admin/posts", data);
  }

  async update(
    id: string,
    data: UpdatePostRequest
  ): Promise<ApiResponse<Post>> {
    return this.client.patch<Post>(`/admin/posts/${id}`, data);
  }

  async delete(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.client.delete<{ message: string }>(`/admin/posts/${id}`);
  }

  async publish(id: string): Promise<ApiResponse<Post>> {
    return this.client.post<Post>(`/admin/posts/${id}/publish`);
  }

  async schedule(
    id: string,
    data: SchedulePostRequest
  ): Promise<ApiResponse<Post>> {
    return this.client.post<Post>(`/admin/posts/${id}/schedule`, data);
  }
}
