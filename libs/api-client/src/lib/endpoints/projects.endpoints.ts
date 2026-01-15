import { ApiClient, ApiResponse } from "../api-client";

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  featured: boolean;
  order: number;
  techStack: string[];
  links: {
    github?: string;
    demo?: string;
    website?: string;
  } | null;
  tags: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  images: Array<{
    id: string;
    mediaId: string;
    order: number;
    alt: string | null;
    media: {
      id: string;
      filename: string;
      url: string;
      mimeType: string;
      size: number;
    };
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectRequest {
  title: string;
  description: string;
  featured?: boolean;
  techStack?: string[];
  links?: {
    github?: string;
    demo?: string;
    website?: string;
  };
  tagIds?: string[];
}

export interface UpdateProjectRequest {
  title?: string;
  description?: string;
  featured?: boolean;
  techStack?: string[];
  links?: {
    github?: string;
    demo?: string;
    website?: string;
  };
  tagIds?: string[];
}

export interface ProjectQueryParams {
  page?: number;
  limit?: number;
  featured?: boolean;
  search?: string;
  tagId?: string;
  sortBy?: "createdAt" | "updatedAt" | "order" | "title";
  sortOrder?: "asc" | "desc";
}

export interface ReorderProjectsRequest {
  projectIds: string[];
}

export class ProjectsEndpoints {
  constructor(private client: ApiClient) {}

  async listPublic(
    params?: ProjectQueryParams
  ): Promise<ApiResponse<Project[]>> {
    return this.client.get<Project[]>("/public/projects", { params });
  }

  async getPublicBySlug(slug: string): Promise<ApiResponse<Project>> {
    return this.client.get<Project>(`/public/projects/${slug}`);
  }

  async listAdmin(
    params?: ProjectQueryParams
  ): Promise<ApiResponse<Project[]>> {
    return this.client.get<Project[]>("/admin/projects", { params });
  }

  async getAdminById(id: string): Promise<ApiResponse<Project>> {
    return this.client.get<Project>(`/admin/projects/${id}`);
  }

  async create(data: CreateProjectRequest): Promise<ApiResponse<Project>> {
    return this.client.post<Project>("/admin/projects", data);
  }

  async update(
    id: string,
    data: UpdateProjectRequest
  ): Promise<ApiResponse<Project>> {
    return this.client.patch<Project>(`/admin/projects/${id}`, data);
  }

  async delete(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.client.delete<{ message: string }>(`/admin/projects/${id}`);
  }

  async toggleFeatured(id: string): Promise<ApiResponse<Project>> {
    return this.client.patch<Project>(`/admin/projects/${id}/featured`);
  }

  async reorder(
    data: ReorderProjectsRequest
  ): Promise<ApiResponse<{ message: string }>> {
    return this.client.post<{ message: string }>(
      "/admin/projects/reorder",
      data
    );
  }
}
