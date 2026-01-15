import { ApiClient, ApiClientConfig } from "./api-client";
import { AuthEndpoints } from "./endpoints/auth.endpoints";
import { PostsEndpoints } from "./endpoints/posts.endpoints";
import { ProjectsEndpoints } from "./endpoints/projects.endpoints";
import { MediaEndpoints } from "./endpoints/media.endpoints";
import { TagsEndpoints } from "./endpoints/tags.endpoints";
import { AuditEndpoints } from "./endpoints/audit.endpoints";
import { ContactEndpoints } from "./endpoints/contact.endpoints";

export class TypedApiClient {
  public readonly auth: AuthEndpoints;
  public readonly posts: PostsEndpoints;
  public readonly projects: ProjectsEndpoints;
  public readonly media: MediaEndpoints;
  public readonly tags: TagsEndpoints;
  public readonly audit: AuditEndpoints;
  public readonly contact: ContactEndpoints;

  private client: ApiClient;

  constructor(config: ApiClientConfig) {
    this.client = new ApiClient(config);
    this.auth = new AuthEndpoints(this.client);
    this.posts = new PostsEndpoints(this.client);
    this.projects = new ProjectsEndpoints(this.client);
    this.media = new MediaEndpoints(this.client);
    this.tags = new TagsEndpoints(this.client);
    this.audit = new AuditEndpoints(this.client);
    this.contact = new ContactEndpoints(this.client);
  }

  setToken(token: string): void {
    this.client.setToken(token);
  }

  setRefreshToken(refreshToken: string): void {
    this.client.setRefreshToken(refreshToken);
  }

  setOnTokenRefresh(callback: (token: string) => void): void {
    this.client.setOnTokenRefresh(callback);
  }

  clearTokens(): void {
    this.client.clearTokens();
  }
}

export function createTypedApiClient(config: ApiClientConfig): TypedApiClient {
  return new TypedApiClient(config);
}
