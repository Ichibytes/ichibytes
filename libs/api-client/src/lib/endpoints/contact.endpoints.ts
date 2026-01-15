import { ApiClient, ApiResponse } from "../api-client";

export interface ContactRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  timestamp: string;
}

export class ContactEndpoints {
  constructor(private client: ApiClient) {}

  async sendMessage(
    data: ContactRequest
  ): Promise<ApiResponse<ContactResponse>> {
    return this.client.post<ContactResponse>("/public/contact", data);
  }
}
