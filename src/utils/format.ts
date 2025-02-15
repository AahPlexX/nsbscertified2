
// filename: /src/utils/format.ts

/**
 * Formats a Date object into a human-readable string
 * @param date - The date to format
 * @returns Formatted date string (e.g., "January 1, 2025")
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

/**
 * Converts cents to a formatted USD currency string
 * @param cents - Amount in cents
 * @returns Formatted currency string (e.g., "$299.00")
 */
export function formatCurrency(cents: number): string {
  const dollars = cents / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(dollars);
}

// Test examples:
// console.log(formatDate(new Date())) // "February 14, 2024"
// console.log(formatCurrency(29900)) // "$299.00"
