// Tag service: CRUD operations
import type { Env, TagRow } from '../env';
import { invalidateTagCaches } from './cache.service';

export async function getTags(env: Env): Promise<TagRow[]> {
  const rows = await env.DB.prepare('SELECT * FROM tags ORDER BY name ASC').all<TagRow>();
  return rows.results || [];
}

export async function getTagsWithCounts(env: Env): Promise<(TagRow & { article_count: number })[]> {
  const rows = await env.DB.prepare(
    `SELECT t.*, COUNT(at2.article_id) as article_count
     FROM tags t
     LEFT JOIN article_tags at2 ON at2.tag_id = t.id
     LEFT JOIN articles a ON a.id = at2.article_id AND a.status = 'published'
     GROUP BY t.id ORDER BY article_count DESC, t.name ASC`
  ).all<TagRow & { article_count: number }>();
  return rows.results || [];
}

export async function getTagBySlug(env: Env, slug: string): Promise<TagRow | null> {
  return env.DB.prepare('SELECT * FROM tags WHERE slug = ?').bind(slug).first<TagRow>();
}

export async function getTagById(env: Env, id: number): Promise<TagRow | null> {
  return env.DB.prepare('SELECT * FROM tags WHERE id = ?').bind(id).first<TagRow>();
}

export async function createTag(env: Env, data: { name: string; slug: string }): Promise<TagRow> {
  const result = await env.DB.prepare(
    'INSERT INTO tags (name, slug) VALUES (?, ?) RETURNING *'
  ).bind(data.name, data.slug).first<TagRow>();
  return result!;
}

export async function updateTag(env: Env, id: number, data: { name?: string; slug?: string }): Promise<TagRow | null> {
  const old = await getTagById(env, id);
  if (!old) return null;
  const name = data.name ?? old.name;
  const slug = data.slug ?? old.slug;
  const result = await env.DB.prepare(
    'UPDATE tags SET name=?, slug=? WHERE id=? RETURNING *'
  ).bind(name, slug, id).first<TagRow>();
  await invalidateTagCaches(env, old.slug);
  if (slug !== old.slug) await invalidateTagCaches(env, slug);
  return result;
}

export async function deleteTag(env: Env, id: number): Promise<boolean> {
  const old = await getTagById(env, id);
  if (!old) return false;
  await env.DB.prepare('DELETE FROM tags WHERE id = ?').bind(id).run();
  await invalidateTagCaches(env, old.slug);
  return true;
}

export async function findOrCreateTag(env: Env, name: string, slug: string): Promise<TagRow> {
  const existing = await getTagBySlug(env, slug);
  if (existing) return existing;
  return createTag(env, { name, slug });
}
