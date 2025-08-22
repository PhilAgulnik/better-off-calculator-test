/**
 * Format currency values
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: GBP)
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount, currency = 'GBP') {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '£0.00';
  }
  
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * Format tax year for display
 * @param {string} taxYear - Tax year in format YYYY_YY
 * @returns {string} Formatted tax year
 */
export function formatTaxYear(taxYear) {
  if (!taxYear) return '';
  return taxYear.replace('_', '/');
}

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export function formatDate(date) {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(dateObj);
}

/**
 * Format percentage
 * @param {number} value - Value to format as percentage
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage string
 */
export function formatPercentage(value, decimals = 1) {
  if (typeof value !== 'number' || isNaN(value)) {
    return '0%';
  }
  
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format number with thousands separators
 * @param {number} value - Number to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted number string
 */
export function formatNumber(value, decimals = 0) {
  if (typeof value !== 'number' || isNaN(value)) {
    return '0';
  }
  
  return new Intl.NumberFormat('en-GB', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
}
