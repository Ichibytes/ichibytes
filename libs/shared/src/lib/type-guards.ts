/**
 * Type Guards and Validators
 *
 * Runtime type checking utilities for shared types.
 */

import { UserRole, PostStatus } from "./enums";
import {
  User,
  Post,
  Project,
  Tag,
  Media,
  PaginatedResponse,
  ApiResponse,
} from "./interfaces";

/**
 * Type guard for UserRole enum
 */
export function isUserRole(value: unknown): value is UserRole {
  return (
    typeof value === "string" &&
    Object.values(UserRole).includes(value as UserRole)
  );
}

/**
 * Type guard for PostStatus enum
 */
export function isPostStatus(value: unknown): value is PostStatus {
  return (
    typeof value === "string" &&
    Object.values(PostStatus).includes(value as PostStatus)
  );
}

/**
 * Type guard for User object
 */
export function isUser(value: unknown): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "email" in value &&
    "role" in value &&
    typeof (value as any).id === "string" &&
    typeof (value as any).email === "string" &&
    isUserRole((value as any).role)
  );
}

/**
 * Type guard for Post object
 */
export function isPost(value: unknown): value is Post {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "title" in value &&
    "slug" in value &&
    "content" in value &&
    "status" in value &&
    "authorId" in value &&
    typeof (value as any).id === "string" &&
    typeof (value as any).title === "string" &&
    typeof (value as any).slug === "string" &&
    typeof (value as any).content === "string" &&
    isPostStatus((value as any).status) &&
    typeof (value as any).authorId === "string"
  );
}

/**
 * Type guard for Project object
 */
export function isProject(value: unknown): value is Project {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "title" in value &&
    "slug" in value &&
    "description" in value &&
    "featured" in value &&
    "order" in value &&
    typeof (value as any).id === "string" &&
    typeof (value as any).title === "string" &&
    typeof (value as any).slug === "string" &&
    typeof (value as any).description === "string" &&
    typeof (value as any).featured === "boolean" &&
    typeof (value as any).order === "number"
  );
}

/**
 * Type guard for Tag object
 */
export function isTag(value: unknown): value is Tag {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "name" in value &&
    "slug" in value &&
    typeof (value as any).id === "string" &&
    typeof (value as any).name === "string" &&
    typeof (value as any).slug === "string"
  );
}

/**
 * Type guard for Media object
 */
export function isMedia(value: unknown): value is Media {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "filename" in value &&
    "url" in value &&
    "mimeType" in value &&
    "size" in value &&
    typeof (value as any).id === "string" &&
    typeof (value as any).filename === "string" &&
    typeof (value as any).url === "string" &&
    typeof (value as any).mimeType === "string" &&
    typeof (value as any).size === "number"
  );
}

/**
 * Type guard for PaginatedResponse
 */
export function isPaginatedResponse<T>(
  value: unknown,
  itemGuard?: (item: unknown) => item is T
): value is PaginatedResponse<T> {
  if (
    typeof value !== "object" ||
    value === null ||
    !("data" in value) ||
    !("meta" in value)
  ) {
    return false;
  }

  const response = value as any;

  // Check data is an array
  if (!Array.isArray(response.data)) {
    return false;
  }

  // If item guard provided, validate each item
  if (itemGuard) {
    if (!response.data.every(itemGuard)) {
      return false;
    }
  }

  // Check meta structure
  const meta = response.meta;
  return (
    typeof meta === "object" &&
    meta !== null &&
    typeof meta.page === "number" &&
    typeof meta.limit === "number" &&
    typeof meta.total === "number" &&
    typeof meta.totalPages === "number" &&
    typeof meta.hasNext === "boolean" &&
    typeof meta.hasPrev === "boolean"
  );
}

/**
 * Type guard for ApiResponse
 */
export function isApiResponse<T>(
  value: unknown,
  dataGuard?: (data: unknown) => data is T
): value is ApiResponse<T> {
  if (typeof value !== "object" || value === null || !("data" in value)) {
    return false;
  }

  const response = value as any;

  // If data guard provided, validate data
  if (dataGuard) {
    return dataGuard(response.data);
  }

  return true;
}

/**
 * Validates ISO 8601 date string
 */
export function isValidISODate(dateString: string): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime()) && dateString === date.toISOString();
}
