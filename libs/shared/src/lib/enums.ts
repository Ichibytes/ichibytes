/**
 * Shared Enums
 *
 * These enums are shared between the API and frontend applications.
 * They match the Prisma schema enums.
 */

/**
 * User roles in the system
 */
export enum UserRole {
  ADMIN = "ADMIN",
  EDITOR = "EDITOR",
  VIEWER = "VIEWER",
}

/**
 * Post publication status
 */
export enum PostStatus {
  DRAFT = "DRAFT",
  SCHEDULED = "SCHEDULED",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
}

/**
 * Sort order for queries
 */
export enum SortOrder {
  ASC = "asc",
  DESC = "desc",
}

/**
 * Common sort fields for posts
 */
export enum PostSortField {
  PUBLISHED_AT = "publishedAt",
  CREATED_AT = "createdAt",
  UPDATED_AT = "updatedAt",
  TITLE = "title",
}

/**
 * Common sort fields for projects
 */
export enum ProjectSortField {
  CREATED_AT = "createdAt",
  UPDATED_AT = "updatedAt",
  ORDER = "order",
  TITLE = "title",
}
