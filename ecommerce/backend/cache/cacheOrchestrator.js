import { getCache, setCache } from './cacheService.js';

export const cacheOrchestrator = async ({ key, ttl, fetch }) => {
  // Try to get from cache first
  const cached = await getCache(key);
  if (cached) {
    console.log(`Cache hit for key: ${key}`);
    return cached;
  }
  
  console.log(`Cache miss for key: ${key}`);
  
  // Fetch fresh data
  const data = await fetch();
  
  // Store in cache - ttl must be a NUMBER (seconds)
  // Validate ttl before passing
  const ttlNumber = Number(ttl);
  if (isNaN(ttlNumber)) {
    console.error(`Invalid TTL for key ${key}:`, ttl);
    throw new Error(`TTL must be a number, got: ${typeof ttl} = ${ttl}`);
  }
  console.log('About to cache:', {
  key: typeof key,
  keyValue: key,
  data: typeof data,
  ttl: typeof ttl,
  ttlValue: ttl
});
  await setCache(key, data, ttlNumber);
  
  return data;
};