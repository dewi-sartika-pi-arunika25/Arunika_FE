/**
 * Storage utilities dengan expiry support
 * Untuk menyimpan data assessment hasil (tanpa expiry untuk assessment cache)
 */

/**
 * Set item dengan expiry (tanpa expiry default untuk assessment cache)
 * @param {string} key - Storage key
 * @param {any} value - Data to store
 * @param {number|null} hours - Expiry in hours (null = no expiry, default: null untuk no expiry)
 */
export function setWithExpiry(key, value, hours = null) {
  if (typeof window === 'undefined') return;
  
  const now = new Date();
  const item = {
    value: value,
    // Jika hours adalah null, tidak ada expiry (expiry = null atau sangat jauh di masa depan)
    expiry: hours === null ? null : now.getTime() + (hours * 60 * 60 * 1000), // hours to milliseconds
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
        if (item.expiry !== undefined && item.expiry !== null) {
          // New format with expiry
          const now = new Date();
          if (now.getTime() > item.expiry) {
            // Item expired, remove it (hanya jika ada expiry, bukan null)
            localStorage.removeItem(key);
            return null;
          }
          // Migrate data dengan expiry ke format tanpa expiry untuk assessment cache
          // (untuk key assessment cache, selalu migrate ke no expiry)
          if (key.includes('assessment') || key.includes('disc') || key.includes('riasec')) {
            setWithExpiry(key, item.value, null);
          }
          return item.value;
        } else if (item.expiry === null) {
          // New format dengan no expiry (expiry = null)
          return item.value;
        } else {
          // Old format (direct value, no expiry) - migrate to new format tanpa expiry
          setWithExpiry(key, item, null);
          return item;
        }
      } catch (parseError) {
        // If JSON parse fails, might be plain string - try to migrate
        try {
          const plainValue = JSON.parse(itemStr);
          setWithExpiry(key, plainValue, null); // No expiry untuk assessment cache
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
        if (sessionItem.expiry !== undefined && sessionItem.expiry !== null) {
          // New format with expiry
          const now = new Date();
          if (now.getTime() > sessionItem.expiry) {
            sessionStorage.removeItem(key);
            return null;
          }
          // Migrate to localStorage tanpa expiry untuk assessment cache
          // (untuk assessment cache, selalu migrate ke no expiry)
          setWithExpiry(key, sessionItem.value, null);
          return sessionItem.value;
        } else if (sessionItem.expiry === null) {
          // New format dengan no expiry - migrate to localStorage
          setWithExpiry(key, sessionItem.value, null);
          return sessionItem.value;
        } else {
          // Old format (direct value) - migrate to localStorage tanpa expiry
          setWithExpiry(key, sessionItem, null);
          return sessionItem;
        }
      } catch {
        // Not JSON, might be plain string - migrate to localStorage
        try {
          const plainValue = JSON.parse(sessionItemStr);
          setWithExpiry(key, plainValue, null); // No expiry untuk assessment cache
          return plainValue;
        } catch {
          // Plain string, migrate as is
          setWithExpiry(key, sessionItemStr, null); // No expiry untuk assessment cache
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

