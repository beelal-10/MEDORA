type RateLimitBucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, RateLimitBucket>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
}

export function getClientIdentifier(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const userAgent = request.headers.get('user-agent') || 'unknown-agent';

  if (forwardedFor) {
    return `${forwardedFor}:${userAgent}`;
  }

  if (realIp) {
    return `${realIp}:${userAgent}`;
  }

  return `local:${userAgent}`;
}

export function checkRateLimit(
  key: string,
  limit: number = 20,
  windowMs: number = 60000
): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key) || { count: 0, resetAt: now + windowMs };

  if (now >= existing.resetAt) {
    existing.count = 0;
    existing.resetAt = now + windowMs;
  }

  if (existing.count >= limit) {
    const retryAfterMs = Math.max(existing.resetAt - now, 0);
    return {
      allowed: false,
      remaining: 0,
      retryAfterMs
    };
  }

  existing.count += 1;
  buckets.set(key, existing);

  return {
    allowed: true,
    remaining: Math.max(limit - existing.count, 0),
    retryAfterMs: 0
  };
}
