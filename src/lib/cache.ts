import { kv } from '@vercel/kv';

export interface CacheOptions {
  ex?: number; // Expiration time in seconds
}

export const cacheService = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await kv.get<T>(key);
      return data;
    } catch (error) {
      console.error(`KV GET Error for key ${key}:`, error);
      return null;
    }
  },

  async set<T>(key: string, value: T, options?: CacheOptions): Promise<void> {
    try {
      if (options?.ex) {
        await kv.set(key, value, { ex: options.ex });
      } else {
        await kv.set(key, value);
      }
    } catch (error) {
      console.error(`KV SET Error for key ${key}:`, error);
    }
  },

  async invalidate(key: string): Promise<void> {
    try {
      await kv.del(key);
    } catch (error) {
      console.error(`KV INVAL Error for key ${key}:`, error);
    }
  }
};

/**
 * L2 Intent Cache — caches results based on normalized plan structure rather than raw query text.
 * This means "show me AAPL's latest 10-K risk factors" and "open Apple latest 10-K risks" hit the same entry.
 */
export function buildIntentCacheKey(plan: { goal?: string; actions: Array<{ type: string; input?: Record<string, unknown> }> }): string {
  const normalized = plan.actions
    .map(a => `${a.type}:${JSON.stringify(a.input || {})}`)
    .sort()
    .join('|');
  const hash = normalized + ':' + (plan.goal || '');
  // Simple hash
  let h = 0;
  for (let i = 0; i < hash.length; i++) {
    h = ((h << 5) - h + hash.charCodeAt(i)) | 0;
  }
  return `intent:${Math.abs(h).toString(36)}`;
}

export const intentCacheService = {
  async get<T>(plan: { goal?: string; actions: Array<{ type: string; input?: Record<string, unknown> }> }): Promise<T | null> {
    const key = buildIntentCacheKey(plan);
    return cacheService.get<T>(key);
  },

  async set<T>(plan: { goal?: string; actions: Array<{ type: string; input?: Record<string, unknown> }> }, value: T): Promise<void> {
    const key = buildIntentCacheKey(plan);
    await cacheService.set(key, value, { ex: 86400 }); // 24h TTL
  },
};
