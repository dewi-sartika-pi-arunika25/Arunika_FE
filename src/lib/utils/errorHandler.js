/**
 * Centralized error handling utilities
 * Provides consistent error messages across the application
 */

/**
 * Extract backend host from API URL
 * @param {string} apiUrl - Full API URL (e.g., "http://localhost:5000/api")
 * @returns {string} - Backend host (e.g., "http://localhost:5000")
 */
export function getBackendHost(apiUrl) {
  if (!apiUrl) return 'http://localhost:5000';
  return apiUrl.replace(/\/api$/, '').replace(/\/$/, '');
}

/**
 * Format user-friendly error message for API errors
 * @param {Error} error - Error object from API call
 * @param {string} defaultMessage - Default error message
 * @returns {string} - User-friendly error message
 */
export function formatApiError(error, defaultMessage = 'Terjadi kesalahan') {
  const errorMsg = error.response?.data?.error || error.message || defaultMessage;
  
  // Check if it's a 404 - backend might not be running
  if (error.response?.status === 404 || error.code === 'ERR_BAD_REQUEST') {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const backendHost = getBackendHost(backendUrl);
    return `Backend tidak dapat diakses. Pastikan server backend berjalan di ${backendHost}`;
  }
  
  return errorMsg;
}

/**
 * Check if error is a network/connection error
 * @param {Error} error - Error object
 * @returns {boolean}
 */
export function isNetworkError(error) {
  return (
    error.code === 'ERR_NETWORK' ||
    error.code === 'ERR_BAD_REQUEST' ||
    error.response?.status === 404 ||
    error.message?.includes('Network Error')
  );
}

