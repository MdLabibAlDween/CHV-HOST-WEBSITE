/**
 * Minimal in-memory sliding-window rate limiter for public API routes.
 * Good for a single-instance deployment. For multi-instance setups,
 * replace with a Redis-backed limiter (same interface).
 */

interface Bucket {
  hits: number[];
}

const buckets = new Map<string, Bucket>();

function sweep(bucket: Bucket, windowMs: number, now: number) {
  bucket.hits = bucket.hits.filter((t) => now - t < windowMs);
}

export function rateLimit(
  key: string,
  opts: { max?: number; windowMs?: number } = {},
): { allowed: boolean; retryAfterMs?: number } {
  const max = opts.max ?? 20;
  const windowMs = opts.windowMs ?? 60_000;
  const now = Date.now();

  let bucket = buckets.get(key);
  if (!bucket) {
    bucket = { hits: [] };
    buckets.set(key, bucket);
  }
  sweep(bucket, windowMs, now);

  if (bucket.hits.length >= max) {
    const oldest = bucket.hits[0];
    return { allowed: false, retryAfterMs: Math.max(0, oldest + windowMs - now) };
  }
  bucket.hits.push(now);
  return { allowed: true };
}

export function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "local";
  return ip;
}
