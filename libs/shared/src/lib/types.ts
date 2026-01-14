/**
 * Shared types for frontend and backend consumption
 * These are plain TypeScript types (no decorators) that can be used across the monorepo
 */

// Enums
export enum UserRole {
  ADMIN = "ADMIN",
  EDITOR = "EDITOR",
  VIEWER = "VIEWER",
}

export enum PostStatus {
  DRAFT = "DRAFT",
  SCHEDULED = "SCHEDULED",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
}

// Pagination
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// Base Response
export interface ApiResponse<T> {
  data: T;
  meta?: {
    timestamp?: string;
    [key: string]: unknown;
  };
}

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta: {
    timestamp: string;
    requestId?: string;
    [key: string]: unknown;
  };
}

// Post Types
export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  status: PostStatus;
  publishedAt?: string;
  scheduledAt?: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

// Project Types
export interface ProjectLinks {
  github?: string;
  demo?: string;
  docs?: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  featured: boolean;
  order: number;
  techStack: string[];
  links?: ProjectLinks;
  createdAt: string;
  updatedAt: string;
}

// Media Types
export interface Media {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  uploadedBy: string;
  createdAt: string;
}

// User Types
export interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  createdAt: string;
  updatedAt: string;
}

// Tag Types
export interface Tag {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}
