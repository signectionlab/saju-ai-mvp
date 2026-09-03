const store = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string, limit = Number(process.env.RATE_LIMIT_DAILY ?? 50)): {
  allowed: boolean;
  remaining: number;
} {
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + dayMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  entry.count += 1;
  return { allowed: true, remaining: limit - entry.count };
}
