/**
 * Utility formatting helpers for the Crypto Analytics Dashboard
 */

/**
 * Format a number as USD currency
 * @param {number|string} value
 * @param {number} decimals
 */
export function formatCurrency(value, decimals = 2) {
  const num = parseFloat(value);
  if (isNaN(num)) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

/**
 * Format large numbers with B / M / K suffixes
 * @param {number|string} value
 */
export function formatLargeNumber(value) {
  const num = parseFloat(value);
  if (isNaN(num)) return '—';
  if (Math.abs(num) >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (Math.abs(num) >= 1e9)  return `$${(num / 1e9).toFixed(2)}B`;
  if (Math.abs(num) >= 1e6)  return `$${(num / 1e6).toFixed(2)}M`;
  if (Math.abs(num) >= 1e3)  return `$${(num / 1e3).toFixed(2)}K`;
  return `$${num.toFixed(2)}`;
}

/**
 * Format a percentage value
 * @param {number|string} value
 * @param {number} decimals
 */
export function formatPercent(value, decimals = 2) {
  const num = parseFloat(value);
  if (isNaN(num)) return '—';
  const sign = num >= 0 ? '+' : '';
  return `${sign}${num.toFixed(decimals)}%`;
}

/**
 * Format a number with thousand separators
 * @param {number|string} value
 */
export function formatNumber(value) {
  const num = parseFloat(value);
  if (isNaN(num)) return '—';
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Format a date string to locale date
 * @param {string|Date} value
 */
export function formatDate(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

/**
 * Get initials from a coin name (up to 4 chars)
 * @param {string} name
 * @param {string} symbol
 */
export function getCoinInitials(name, symbol) {
  if (symbol && symbol.length <= 4) return symbol.toUpperCase();
  if (name) return name.substring(0, 3).toUpperCase();
  return '?';
}

/**
 * Determine if a change value is positive, negative, or neutral
 * @param {number|string} value
 * @returns {'positive' | 'negative' | 'neutral'}
 */
export function getChangeClass(value) {
  const num = parseFloat(value);
  if (isNaN(num)) return 'neutral';
  if (num > 0) return 'positive';
  if (num < 0) return 'negative';
  return 'neutral';
}

/**
 * Format price intelligently — show more decimals for small coins
 * @param {number|string} value
 */
export function formatPrice(value) {
  const num = parseFloat(value);
  if (isNaN(num)) return '—';
  if (num >= 1000) return formatCurrency(num, 2);
  if (num >= 1)    return formatCurrency(num, 4);
  if (num >= 0.01) return formatCurrency(num, 5);
  return formatCurrency(num, 8);
}
