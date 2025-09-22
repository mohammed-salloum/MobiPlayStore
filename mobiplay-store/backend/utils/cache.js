import NodeCache from "node-cache";

const DEFAULT_TTL = 3600;
const CHECK_PERIOD = 120;
const cache = new NodeCache({ stdTTL: DEFAULT_TTL, checkperiod: CHECK_PERIOD });

function debugLog(...args) {
  if (process.env.NODE_ENV !== "production") console.log("[CACHE DEBUG]:", ...args);
}

cache.on("expired", (key, value) => debugLog(`Expired key: ${key}, type: ${typeof value}`));

export function setCache(key, value, ttl) {
  try { cache.set(key, value, ttl ?? DEFAULT_TTL); debugLog(`Set key "${key}"`); }
  catch (err) { console.error(`❌ Failed to set cache for key "${key}":`, err.message); }
}

export function getCache(key, fallback = null) {
  try { const val = cache.get(key); return val !== undefined ? val : fallback; }
  catch (err) { console.error(`❌ Failed to get cache for key "${key}":`, err.message); return fallback; }
}

export function deleteCache(key) { try { cache.del(key); debugLog(`Deleted key "${key}"`); } catch { } }
export function clearCache() { try { cache.flushAll(); debugLog("Cache cleared"); } catch { } }
