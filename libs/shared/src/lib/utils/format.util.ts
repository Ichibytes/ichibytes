/**
 * Formatting Utilities
 *
 * Utilities for formatting data for display.
 */

/**
 * Formats a number with commas as thousands separators
 */
export function formatNumber(value: number): string {
  return value.toLocaleString("en-US");
}

/**
 * Formats a number as currency
 */
export function formatCurrency(
  value: number,
  currency: string = "USD",
  locale: string = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(value);
}

/**
 * Formats a file size in bytes to human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

/**
 * Formats a duration in milliseconds to human-readable format
 */
export function formatDuration(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} day${days !== 1 ? "s" : ""}`;
  }
  if (hours > 0) {
    return `${hours} hour${hours !== 1 ? "s" : ""}`;
  }
  if (minutes > 0) {
    return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
  }
  return `${seconds} second${seconds !== 1 ? "s" : ""}`;
}

/**
 * Truncates a string to a maximum length with ellipsis
 */
export function truncate(
  text: string,
  maxLength: number,
  suffix: string = "..."
): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * Capitalizes the first letter of a string
 */
export function capitalize(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Converts a string to title case
 */
export function toTitleCase(text: string): string {
  return text
    .toLowerCase()
    .split(" ")
    .map((word) => capitalize(word))
    .join(" ");
}

/**
 * Formats a percentage value
 */
export function formatPercentage(value: number, decimals: number = 0): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Masks sensitive information (e.g., email, phone)
 */
export function maskSensitive(
  value: string,
  type: "email" | "phone" = "email"
): string {
  if (type === "email") {
    const [local, domain] = value.split("@");
    if (!domain) return value;
    const maskedLocal =
      local.length > 2
        ? local.substring(0, 2) + "*".repeat(Math.min(local.length - 2, 4))
        : "*".repeat(local.length);
    return `${maskedLocal}@${domain}`;
  }

  if (type === "phone") {
    const digits = value.replace(/\D/g, "");
    if (digits.length < 4) return "*".repeat(value.length);
    return "*".repeat(digits.length - 4) + digits.slice(-4);
  }

  return value;
}
