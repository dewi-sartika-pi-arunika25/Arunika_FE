/**
 * Centralized logging utility
 * Allows easy control of logging levels and can be extended for production logging
 */

const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Log info message (only in development)
 */
export function logInfo(message, ...args) {
  if (isDevelopment) {
    console.log(message, ...args);
  }
}

/**
 * Log warning message
 */
export function logWarning(message, ...args) {
  if (isDevelopment) {
    console.warn(message, ...args);
  }
  // In production, could send to error tracking service
}

/**
 * Log error message
 */
export function logError(message, ...args) {
  console.error(message, ...args);
  // In production, should send to error tracking service (e.g., Sentry)
}

/**
 * Log debug message (only in development)
 */
export function logDebug(message, ...args) {
  if (isDevelopment) {
    console.log(`[DEBUG] ${message}`, ...args);
  }
}

