const buckets = new Map();
const MAX_BUCKETS = 10_000;

function checkRateLimit(key, { limit, windowMs }) {
  const now = Date.now();
  if (buckets.size >= MAX_BUCKETS) {
    for (const [bucketKey, bucket] of buckets) {
      if (bucket.resetAt <= now || buckets.size >= MAX_BUCKETS) {
        buckets.delete(bucketKey);
      }
      if (buckets.size < MAX_BUCKETS) break;
    }
  }
  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  current.count += 1;
  if (current.count <= limit) {
    return { allowed: true, retryAfterSeconds: 0 };
  }

  return {
    allowed: false,
    retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
  };
}

module.exports = { checkRateLimit };
