/**
 * Shared Interfaces
 *
 * Common interfaces used across the application.
 */

import { UserRole, PostStatus } from "./enums";

/**
 * Base entity interface with common fields
 */
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * User interface
 */
export interface User {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

/**
 * Post interface
 */
export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  status: PostStatus;
  publishedAt: string | null;
  scheduledAt: string | null;
  authorId: string;
  author: User;
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Project interface
 */
export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  featured: boolean;
  order: number;
  techStack: string[];
  links: ProjectLinks | null;
  tags: Tag[];
  images: ProjectImage[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Project links interface
 */
export interface ProjectLinks {
  github?: string;
  demo?: string;
  website?: string;
  docs?: string;
}

/**
 * Project image interface
 */
export interface ProjectImage {
  id: string;
  projectId: string;
  mediaId: string;
  order: number;
  alt: string | null;
  media: Media;
}

/**
 * Tag interface
 */
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

/**
 * Media interface
 */
export interface Media {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  uploadedBy: string;
  uploader: User;
  createdAt: string;
}

/**
 * Audit log interface
 */
export interface AuditLog {
  id: string;
  userId: string | null;
  user: User | null;
  action: string;
  resourceType: string;
  resourceId: string | null;
  changes: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  meta?: {
    timestamp?: string;
    [key: string]: unknown;
  };
}

/**
 * Error response
 */
export interface ErrorResponse {
  message: string;
  statusCode: number;
  errors?: string[];
  timestamp?: string;
}

/**
 * Login request
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Login response
 */
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}

/**
 * Refresh token request
 */
export interface RefreshTokenRequest {
  refreshToken: string;
}

/**
 * Refresh token response
 */
export interface RefreshTokenResponse {
  accessToken: string;
  expiresIn: number;
}

/**
 * Contact form submission
 */
export interface ContactRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
}

/**
 * Contact form response
 */
export interface ContactResponse {
  success: boolean;
  message: string;
  timestamp: string;
}
