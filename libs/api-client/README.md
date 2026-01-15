# API Client Library

A typed API client library for the Ichibytes API, providing a clean, type-safe interface for all API endpoints.

## Features

- ✅ **Fully Typed**: TypeScript types for all requests and responses
- ✅ **Authentication**: Automatic token management and refresh
- ✅ **Interceptors**: Request/response interceptors for error handling
- ✅ **Error Handling**: Comprehensive error handling with typed errors
- ✅ **File Upload**: Support for file uploads with progress tracking
- ✅ **Endpoint Coverage**: Typed methods for all API endpoints
- ✅ **OpenAPI Schema**: Optional type generation from OpenAPI schema

## Installation

The library is part of the Nx monorepo and can be imported directly:

```typescript
import { createTypedApiClient } from "@ichibytes/api-client";
```

## Usage

### Basic Setup

```typescript
import { createTypedApiClient } from "@ichibytes/api-client";

const apiClient = createTypedApiClient({
  baseURL: "http://localhost:3000/api/v1",
  timeout: 30000,
});

// Set authentication tokens
apiClient.setToken("your-access-token");
apiClient.setRefreshToken("your-refresh-token");

// Optional: Handle token refresh
apiClient.setOnTokenRefresh((newToken) => {
  // Save new token to storage
  localStorage.setItem("accessToken", newToken);
});
```

### Authentication

```typescript
// Login
const loginResponse = await apiClient.auth.login({
  email: "user@example.com",
  password: "password123",
});

// Save tokens
apiClient.setToken(loginResponse.data.accessToken);
apiClient.setRefreshToken(loginResponse.data.refreshToken);

// Logout
await apiClient.auth.logout();
apiClient.clearTokens();
```

### Posts

```typescript
// List public posts
const posts = await apiClient.posts.listPublic({
  page: 1,
  limit: 10,
  status: "PUBLISHED",
});

// Get post by slug
const post = await apiClient.posts.getPublicBySlug("my-post-slug");

// Create post (admin)
const newPost = await apiClient.posts.create({
  title: "My New Post",
  content: "Post content...",
  excerpt: "Post excerpt",
  status: "DRAFT",
  tagIds: ["tag-id-1", "tag-id-2"],
});

// Update post
const updatedPost = await apiClient.posts.update(postId, {
  title: "Updated Title",
  expectedUpdatedAt: post.updatedAt, // Optimistic concurrency
});

// Publish post
const publishedPost = await apiClient.posts.publish(postId);

// Delete post
await apiClient.posts.delete(postId);
```

### Projects

```typescript
// List public projects
const projects = await apiClient.projects.listPublic({
  featured: true,
  page: 1,
  limit: 10,
});

// Get project by slug
const project = await apiClient.projects.getPublicBySlug("my-project-slug");

// Create project (admin)
const newProject = await apiClient.projects.create({
  title: "My Project",
  description: "Project description...",
  featured: true,
  techStack: ["React", "TypeScript"],
  links: {
    github: "https://github.com/user/repo",
    demo: "https://demo.example.com",
  },
  tagIds: ["tag-id-1"],
});

// Toggle featured status
const updatedProject = await apiClient.projects.toggleFeatured(projectId);

// Reorder projects
await apiClient.projects.reorder({
  projectIds: ["id-1", "id-2", "id-3"],
});
```

### Media

```typescript
// Upload file directly
const media = await apiClient.media.upload(file, (progress) => {
  console.log(`Upload progress: ${progress}%`);
});

// Generate signed upload URL
const uploadUrl = await apiClient.media.generateUploadUrl({
  filename: "image.jpg",
  mimeType: "image/jpeg",
});

// Upload to signed URL (client-side)
// ... upload file to uploadUrl.data.uploadUrl ...

// Confirm upload
const confirmedMedia = await apiClient.media.confirmUpload({
  mediaId: uploadUrl.data.mediaId,
  filename: "image.jpg",
  mimeType: "image/jpeg",
  size: 1024000,
});

// List media
const mediaList = await apiClient.media.list({
  page: 1,
  limit: 20,
  mimeType: "image/jpeg",
});

// Get media stats
const stats = await apiClient.media.getStats();
```

### Tags

```typescript
// List tags
const tags = await apiClient.tags.list({
  page: 1,
  limit: 20,
  search: "react",
});

// Create tag
const newTag = await apiClient.tags.create({
  name: "React",
});

// Update tag
const updatedTag = await apiClient.tags.update(tagId, {
  name: "React.js",
});

// Delete tag
await apiClient.tags.delete(tagId);
```

### Audit Logs

```typescript
// List audit logs (admin only)
const auditLogs = await apiClient.audit.list({
  page: 1,
  limit: 20,
  action: "create",
  resourceType: "post",
  startDate: "2025-01-01T00:00:00.000Z",
  endDate: "2025-01-31T23:59:59.999Z",
});

// Get audit logs for a resource
const resourceLogs = await apiClient.audit.getByResource("post", postId);

// Get audit logs for a user
const userLogs = await apiClient.audit.getByUser(userId);
```

### Contact

```typescript
// Send contact message
const response = await apiClient.contact.sendMessage({
  name: "John Doe",
  email: "john@example.com",
  subject: "Hello",
  message: "Your message here...",
  phone: "+1234567890", // optional
});
```

## Error Handling

The API client automatically handles errors and provides typed error responses:

```typescript
try {
  const post = await apiClient.posts.getAdminById(postId);
} catch (error) {
  if (error.statusCode === 404) {
    console.log("Post not found");
  } else if (error.statusCode === 401) {
    console.log("Unauthorized - token may be expired");
    // Token refresh is handled automatically
  } else {
    console.error("Error:", error.message);
    if (error.errors) {
      console.error("Validation errors:", error.errors);
    }
  }
}
```

## Response Structure

All API responses follow this structure:

```typescript
interface ApiResponse<T> {
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
```

For paginated responses, the `meta` object contains pagination information.

## Token Refresh

The API client automatically handles token refresh when a 401 error is encountered. The refresh token is used to obtain a new access token, and the original request is retried.

You can provide a callback to handle token updates:

```typescript
apiClient.setOnTokenRefresh((newToken) => {
  // Update token in your storage
  localStorage.setItem("accessToken", newToken);
  // Update your state management
  store.dispatch(updateToken(newToken));
});
```

## Type Safety

All endpoints are fully typed. TypeScript will provide autocomplete and type checking for:

- Request parameters
- Request bodies
- Response data
- Query parameters
- Error types

## Examples

See the endpoint files in `src/lib/endpoints/` for complete type definitions and examples.
