/**
 * Markdown Utilities
 *
 * Utilities for parsing and processing Markdown content.
 */

/**
 * Extracts plain text from markdown (removes markdown syntax)
 * @param markdown - The markdown text to extract plain text from
 * @returns Plain text without markdown syntax
 */
export function extractPlainText(markdown: string): string {
  return markdown
    .replace(/^#{1,6}\s+(.+)$/gm, "$1") // Headers
    .replace(/\*\*(.+?)\*\*/g, "$1") // Bold
    .replace(/\*(.+?)\*/g, "$1") // Italic
    .replace(/\[(.+?)\]\(.+?\)/g, "$1") // Links
    .replace(/!\[(.+?)\]\(.+?\)/g, "$1") // Images
    .replace(/`(.+?)`/g, "$1") // Inline code
    .replace(/```[\s\S]*?```/g, "") // Code blocks
    .replace(/^\s*[-*+]\s+/gm, "") // Unordered list items
    .replace(/^\s*\d+\.\s+/gm, "") // Ordered list items
    .replace(/^>\s+/gm, "") // Blockquotes
    .replace(/\n{3,}/g, "\n\n") // Multiple newlines
    .trim();
}

/**
 * Generates an excerpt from markdown content
 * @param markdown - The markdown content
 * @param maxLength - Maximum length of the excerpt (default: 200)
 * @returns An excerpt of the markdown content
 */
export function generateExcerpt(markdown: string, maxLength = 200): string {
  const plainText = extractPlainText(markdown);

  if (plainText.length <= maxLength) {
    return plainText;
  }

  // Find the last space before maxLength to avoid cutting words
  const truncated = plainText.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");

  if (lastSpace > 0) {
    return truncated.substring(0, lastSpace) + "...";
  }

  return truncated + "...";
}

/**
 * Counts words in markdown content
 * @param markdown - The markdown content
 * @returns The number of words
 */
export function countWords(markdown: string): number {
  const plainText = extractPlainText(markdown);
  const words = plainText.split(/\s+/).filter((word) => word.length > 0);
  return words.length;
}

/**
 * Estimates reading time in minutes
 * @param markdown - The markdown content
 * @param wordsPerMinute - Average reading speed (default: 200)
 * @returns Estimated reading time in minutes
 */
export function estimateReadingTime(
  markdown: string,
  wordsPerMinute = 200
): number {
  const wordCount = countWords(markdown);
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Extracts headings from markdown
 * @param markdown - The markdown content
 * @returns Array of headings with their level and text
 */
export function extractHeadings(
  markdown: string
): Array<{ level: number; text: string }> {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings: Array<{ level: number; text: string }> = [];
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    headings.push({
      level: match[1].length,
      text: match[2].trim(),
    });
  }

  return headings;
}

/**
 * Extracts links from markdown
 * @param markdown - The markdown content
 * @returns Array of links with their text and URL
 */
export function extractLinks(
  markdown: string
): Array<{ text: string; url: string }> {
  const linkRegex = /\[(.+?)\]\((.+?)\)/g;
  const links: Array<{ text: string; url: string }> = [];
  let match;

  while ((match = linkRegex.exec(markdown)) !== null) {
    links.push({
      text: match[1],
      url: match[2],
    });
  }

  return links;
}
