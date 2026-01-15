/**
 * Date and Time Utilities
 *
 * Utilities for working with dates and times across the application.
 */

/**
 * Formats a date to ISO 8601 string
 */
export function formatISO(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toISOString();
}

/**
 * Formats a date to a readable string
 */
export function formatDate(
  date: Date | string,
  options?: Intl.DateTimeFormatOptions
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return d.toLocaleDateString("en-US", options || defaultOptions);
}

/**
 * Formats a date to a relative time string (e.g., "2 hours ago", "in 3 days")
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  for (const [unit, seconds] of Object.entries(intervals)) {
    const interval = Math.floor(Math.abs(diffInSeconds) / seconds);
    if (interval >= 1) {
      const isPast = diffInSeconds > 0;
      return isPast
        ? `${interval} ${unit}${interval !== 1 ? "s" : ""} ago`
        : `in ${interval} ${unit}${interval !== 1 ? "s" : ""}`;
    }
  }

  return "just now";
}

/**
 * Checks if a date is in the past
 */
export function isPast(date: Date | string): boolean {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.getTime() < Date.now();
}

/**
 * Checks if a date is in the future
 */
export function isFuture(date: Date | string): boolean {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.getTime() > Date.now();
}

/**
 * Gets the start of a day
 */
export function startOfDay(date: Date | string): Date {
  const d = typeof date === "string" ? new Date(date) : date;
  const result = new Date(d);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * Gets the end of a day
 */
export function endOfDay(date: Date | string): Date {
  const d = typeof date === "string" ? new Date(date) : date;
  const result = new Date(d);
  result.setHours(23, 59, 59, 999);
  return result;
}

/**
 * Adds days to a date
 */
export function addDays(date: Date | string, days: number): Date {
  const d = typeof date === "string" ? new Date(date) : date;
  const result = new Date(d);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Adds months to a date
 */
export function addMonths(date: Date | string, months: number): Date {
  const d = typeof date === "string" ? new Date(date) : date;
  const result = new Date(d);
  result.setMonth(result.getMonth() + months);
  return result;
}

/**
 * Adds years to a date
 */
export function addYears(date: Date | string, years: number): Date {
  const d = typeof date === "string" ? new Date(date) : date;
  const result = new Date(d);
  result.setFullYear(result.getFullYear() + years);
  return result;
}

/**
 * Calculates the difference between two dates in days
 */
export function diffInDays(date1: Date | string, date2: Date | string): number {
  const d1 = typeof date1 === "string" ? new Date(date1) : date1;
  const d2 = typeof date2 === "string" ? new Date(date2) : date2;
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Checks if a date is today
 */
export function isToday(date: Date | string): boolean {
  const d = typeof date === "string" ? new Date(date) : date;
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
}

/**
 * Checks if a date is yesterday
 */
export function isYesterday(date: Date | string): boolean {
  const d = typeof date === "string" ? new Date(date) : date;
  const yesterday = addDays(new Date(), -1);
  return (
    d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear()
  );
}

/**
 * Checks if a date is tomorrow
 */
export function isTomorrow(date: Date | string): boolean {
  const d = typeof date === "string" ? new Date(date) : date;
  const tomorrow = addDays(new Date(), 1);
  return (
    d.getDate() === tomorrow.getDate() &&
    d.getMonth() === tomorrow.getMonth() &&
    d.getFullYear() === tomorrow.getFullYear()
  );
}
