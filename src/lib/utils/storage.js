/**
 * Storage utilities dengan expiry support
 * Untuk menyimpan data assessment hasil dengan expiry 24 jam
 */

/**
 * Set item dengan expiry (24 jam default)
 * @param {string} key - Storage key
 * @param {any} value - Data to store
 * @param {number} hours - Expiry in hours (default: 24)
 */
export function setWithExpiry(key, value, hours = 24) {
  if (typeof window === 'undefined') return;
  
  const now = new Date();
  const item = {
    value: value,
    expiry: now.getTime() + (hours * 60 * 60 * 1000), // hours to milliseconds
  };
  
  try {
    localStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    console.error(`Error setting localStorage item ${key}:`, error);
    // Fallback to sessionStorage if localStorage is full
    try {
      sessionStorage.setItem(key, JSON.stringify(item));
    } catch (sessionError) {
      console.error(`Error setting sessionStorage item ${key}:`, sessionError);
    }
  }
}

/**
 * Get item dengan check expiry
 * @param {string} key - Storage key
 * @returns {any|null} - Stored value or null if expired/not found
 */
export function getWithExpiry(key) {
  if (typeof window === 'undefined') return null;
  
  try {
    // Check localStorage first (new format with expiry)
    const itemStr = localStorage.getItem(key);
    if (itemStr) {
      try {
        const item = JSON.parse(itemStr);
        
        // Check if it's new format (with expiry) or old format (direct value)
        if (item.expiry !== undefined) {
          // New format with expiry
          const now = new Date();
          if (now.getTime() > item.expiry) {
            // Item expired, remove it
            localStorage.removeItem(key);
            return null;
          }
          return item.value;
        } else {
          // Old format (direct value, no expiry) - migrate to new format with 24h expiry
          setWithExpiry(key, item, 24);
          return item;
        }
      } catch (parseError) {
        // If JSON parse fails, might be plain string - try to migrate
        try {
          const plainValue = JSON.parse(itemStr);
          setWithExpiry(key, plainValue, 24);
          return plainValue;
        } catch {
          // Not JSON, return as is (backward compatibility)
          return itemStr;
        }
      }
    }
    
    // Try sessionStorage as fallback (backward compatibility for old data)
    const sessionItemStr = sessionStorage.getItem(key);
    if (sessionItemStr) {
      try {
        const sessionItem = JSON.parse(sessionItemStr);
        // Check if it's new format (with expiry) or old format (direct value)
        if (sessionItem.expiry !== undefined) {
          // New format with expiry
          const now = new Date();
          if (now.getTime() > sessionItem.expiry) {
            sessionStorage.removeItem(key);
            return null;
          }
          // Migrate to localStorage
          setWithExpiry(key, sessionItem.value, 24);
          return sessionItem.value;
        } else {
          // Old format (direct value) - migrate to localStorage dengan 24h expiry
          setWithExpiry(key, sessionItem, 24);
          return sessionItem;
        }
      } catch {
        // Not JSON, might be plain string - migrate to localStorage
        try {
          const plainValue = JSON.parse(sessionItemStr);
          setWithExpiry(key, plainValue, 24);
          return plainValue;
        } catch {
          // Plain string, migrate as is
          setWithExpiry(key, sessionItemStr, 24);
          return sessionItemStr;
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error(`Error getting storage item ${key}:`, error);
    return null;
  }
}

/**
 * Remove item from storage
 * @param {string} key - Storage key
 */
export function removeWithExpiry(key) {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing storage item ${key}:`, error);
  }
}

/**
 * Check if item exists and is not expired
 * @param {string} key - Storage key
 * @returns {boolean}
 */
export function hasValidItem(key) {
  return getWithExpiry(key) !== null;
}

