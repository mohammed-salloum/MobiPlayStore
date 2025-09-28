import NodeCache from "node-cache";

// ===== Cache configuration =====
// DEFAULT_TTL: default "time-to-live" in seconds for cache entries.
// CHECK_PERIOD: interval (in seconds) at which expired keys will be automatically checked and removed.
const DEFAULT_TTL = 3600; // 1 hour
const CHECK_PERIOD = 120; // 2 minutes
const cache = new NodeCache({ stdTTL: DEFAULT_TTL, checkperiod: CHECK_PERIOD });

// ===== Debug logger =====
// Logs messages to console only in non-production environments.
// Helps with development and debugging without polluting production logs.
function debugLog(...args) {
  if (process.env.NODE_ENV !== "production") console.log("[CACHE DEBUG]:", ...args);
}

// ===== Event listeners =====
// Listen for "expired" events to know when a key is automatically removed from cache.
cache.on("expired", (key, value) => debugLog(`Expired key: ${key}, type: ${typeof value}`));

// ===== Cache API =====

// Set a value in the cache with an optional TTL (falls back to DEFAULT_TTL if not provided).
export function setCache(key, value, ttl) {
  try {
    cache.set(key, value, ttl ?? DEFAULT_TTL);
    debugLog(`Set key "${key}"`);
  } catch (err) {
    console.error(`❌ Failed to set cache for key "${key}":`, err.message);
  }
}

// Get a value from the cache. Returns "fallback" if the key does not exist or retrieval fails.
export function getCache(key, fallback = null) {
  try {
    const val = cache.get(key);
    return val !== undefined ? val : fallback;
  } catch (err) {
    console.error(`❌ Failed to get cache for key "${key}":`, err.message);
    return fallback;
  }
}

// Delete a specific cache entry by key.
export function deleteCache(key) {
  try {
    cache.del(key);
    debugLog(`Deleted key "${key}"`);
  } catch { }
}

// Clear the entire cache (flush all entries).
export function clearCache() {
  try {
    cache.flushAll();
    debugLog("Cache cleared");
  } catch { }
}
