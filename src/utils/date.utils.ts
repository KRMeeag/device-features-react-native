export const DateUtil = {
  /**
   * Generates the current date formatted as "MMM DD, YYYY" (e.g., "Mar 20, 2026")
   */
  getFormattedDateToday(): string {
    const today = new Date();
    return today.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
  },

  /**
   * Formats a specific Unix timestamp into "MMM DD, YYYY"
   */
  formatTimestamp(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
  }
};