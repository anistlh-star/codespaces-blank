// /ecommerce/backend/utils/hash.js
import crypto from "crypto";
// we are using hashes to create unique identifiers for queries and cache keys. This helps us to efficiently store and retrieve cached results based on the content of the query or the parameters used.as the data grows the keys also grows and it will take time to compute the hash which will cost us ram memory and cpu time. so we are using sha256 for queries and md5 for cache keys. sha256 is more secure but slower than md5, but since we are not using it for security purposes, md5 is sufficient for our cache keys and it is faster than sha256.

export const getQueryHash = (query) => {
  return crypto
    .createHash("sha256")
    .update(query.toLowerCase().trim())
    .digest("hex");
};

export const buildCacheKey = (obj) => {
  // Sort keys alphabetically so {a:1, b:2} and {b:2, a:1} match
  const stableString = JSON.stringify(obj, Object.keys(obj).sort());

  return crypto
    .createHash("md5") // MD5 is fast and is acceptable for cache keys (not used for security)
    .update(stableString)
    .digest("hex");
};
