import { ApiClient, ApiResponse } from "../api-client";

export interface Media {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  uploadedBy: string;
  uploader: {
    id: string;
    email: string;
    name: string | null;
  };
  createdAt: string;
}

export interface MediaQueryParams {
  page?: number;
  limit?: number;
  mimeType?: string;
  search?: string;
}

export interface GenerateUploadUrlRequest {
  filename: string;
  mimeType: string;
}

export interface GenerateUploadUrlResponse {
  uploadUrl: string;
  mediaId: string;
  expiresIn: number;
}

export interface ConfirmUploadRequest {
  mediaId: string;
  filename: string;
  mimeType: string;
  size: number;
}

export interface MediaStats {
  total: number;
  totalSize: number;
  byMimeType: Record<string, number>;
}

export class MediaEndpoints {
  constructor(private client: ApiClient) {}

  async upload(
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<Media>> {
    return this.client.upload<Media>("/admin/media/upload", file, onProgress);
  }

  async generateUploadUrl(
    data: GenerateUploadUrlRequest
  ): Promise<ApiResponse<GenerateUploadUrlResponse>> {
    return this.client.post<GenerateUploadUrlResponse>(
      "/admin/media/generate-upload-url",
      data
    );
  }

  async confirmUpload(data: ConfirmUploadRequest): Promise<ApiResponse<Media>> {
    return this.client.post<Media>("/admin/media/confirm-upload", data);
  }

  async list(params?: MediaQueryParams): Promise<ApiResponse<Media[]>> {
    return this.client.get<Media[]>("/admin/media", { params });
  }

  async getStats(): Promise<ApiResponse<MediaStats>> {
    return this.client.get<MediaStats>("/admin/media/stats");
  }

  async getMyMedia(params?: MediaQueryParams): Promise<ApiResponse<Media[]>> {
    return this.client.get<Media[]>("/admin/media/my", { params });
  }

  async getById(id: string): Promise<ApiResponse<Media>> {
    return this.client.get<Media>(`/admin/media/${id}`);
  }

  async delete(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.client.delete<{ message: string }>(`/admin/media/${id}`);
  }
}
