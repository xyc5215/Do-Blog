// Cache service: KV cache abstraction and invalidation
import type { Env } from '../env';

export async function getCache(env: Env, key: string): Promise<string | null> {
  return env.BLOG_KV.get(key);
}

export async function setCache(env: Env, key: string, value: string, ttlSeconds?: number): Promise<void> {
  const opts: KVNamespacePutOptions = {};
  if (ttlSeconds) opts.expirationTtl = ttlSeconds;
  await env.BLOG_KV.put(key, value, opts);
}

export async function deleteCache(env: Env, key: string): Promise<void> {
  await env.BLOG_KV.delete(key);
}

// Invalidation helpers
export async function invalidateArticleCaches(env: Env, slug?: string): Promise<void> {
  const deletions: Promise<void>[] = [];
  // Home pages
  for (let i = 1; i <= 20; i++) {
    deletions.push(env.BLOG_KV.delete(`page:home:${i}`));
  }
  // Specific article
  if (slug) {
    deletions.push(env.BLOG_KV.delete(`page:article:${slug}`));
  }
  // Archive, sitemap, feed, hot articles
  deletions.push(env.BLOG_KV.delete('page:archive'));
  deletions.push(env.BLOG_KV.delete('page:sitemap'));
  deletions.push(env.BLOG_KV.delete('page:feed'));
  deletions.push(env.BLOG_KV.delete('hot:articles'));
  await Promise.all(deletions);
}

export async function invalidateCategoryCaches(env: Env, slug?: string): Promise<void> {
  await env.BLOG_KV.delete('config:categories');
  if (slug) {
    for (let i = 1; i <= 20; i++) {
      await env.BLOG_KV.delete(`page:category:${slug}:${i}`);
    }
  }
}

export async function invalidateTagCaches(env: Env, slug?: string): Promise<void> {
  if (slug) {
    for (let i = 1; i <= 20; i++) {
      await env.BLOG_KV.delete(`page:tag:${slug}:${i}`);
    }
  }
}

export async function invalidateCommentCaches(env: Env, articleSlug: string): Promise<void> {
  await env.BLOG_KV.delete(`page:article:${articleSlug}`);
}

export async function invalidateAllPageCaches(env: Env): Promise<void> {
  const keys = await env.BLOG_KV.list({ prefix: 'page:' });
  await Promise.all(keys.keys.map((k) => env.BLOG_KV.delete(k.name)));
}
