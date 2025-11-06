/**
 * Centralized error handling utilities
 * Provides consistent error messages across the application
 */

/**
 * API Base URL constant - centralized to avoid duplication
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

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
 * Extract error message from error object (centralized logic)
 * @param {Error} error - Error object from API call
 * @returns {string|null} - Error message or null if not meaningful
 */
export function extractErrorMessage(error) {
  if (!error) return null;
  
  // Try multiple error message locations
  const errorMsg = 
    error?.response?.data?.error?.message ||
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message;
  
  // Return null if message is not meaningful
  if (!errorMsg || errorMsg === 'Unknown error' || typeof errorMsg !== 'string') {
    return null;
  }
  
  return errorMsg;
}

/**
 * Format user-friendly error message for API errors
 * @param {Error} error - Error object from API call
 * @param {string} defaultMessage - Default error message
 * @returns {string} - User-friendly error message
 */
export function formatApiError(error, defaultMessage = 'Terjadi kesalahan') {
  const errorMsg = extractErrorMessage(error) || defaultMessage;
  
  // Check if it's a 404 - backend might not be running
  if (error?.response?.status === 404 || error?.code === 'ERR_BAD_REQUEST') {
    const backendHost = getBackendHost(API_BASE_URL);
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
    error?.code === 'ERR_NETWORK' ||
    error?.code === 'ERR_BAD_REQUEST' ||
    error?.response?.status === 404 ||
    error?.message?.includes('Network Error')
  );
}

/**
 * Forward Set-Cookie headers from backend response to NextResponse
 * Centralized utility to avoid code duplication
 * @param {Response} backendResponse - Response from backend fetch
 * @param {NextResponse} nextResponse - NextResponse object to add headers to
 */
export function forwardSetCookieHeaders(backendResponse, nextResponse) {
  if (!backendResponse || !nextResponse) return;
  
  // Forward Set-Cookie headers from backend (important for httpOnly cookies)
  // Backend may send multiple Set-Cookie headers (access_token, refresh_token)
  const setCookieHeaders = backendResponse.headers.getSetCookie?.() || [];
  if (setCookieHeaders.length > 0) {
    // Forward each Set-Cookie header
    setCookieHeaders.forEach(cookie => {
      nextResponse.headers.append('Set-Cookie', cookie);
    });
  } else {
    // Fallback for older fetch implementations
    const setCookieHeader = backendResponse.headers.get('set-cookie');
    if (setCookieHeader) {
      nextResponse.headers.set('Set-Cookie', setCookieHeader);
    }
  }
}

