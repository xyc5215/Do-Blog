// Category service: CRUD + tree operations
import type { Env, CategoryRow } from '../env';
import { invalidateCategoryCaches } from './cache.service';

export async function getCategories(env: Env): Promise<CategoryRow[]> {
  const cached = await env.BLOG_KV.get('config:categories', 'json');
  if (cached) return cached as CategoryRow[];

  const rows = await env.DB.prepare('SELECT * FROM categories ORDER BY sort_order ASC, name ASC').all<CategoryRow>();
  const result = rows.results || [];
  await env.BLOG_KV.put('config:categories', JSON.stringify(result));
  return result;
}

export interface CategoryTree extends CategoryRow {
  children: CategoryTree[];
  article_count?: number;
}

export function buildCategoryTree(categories: CategoryRow[]): CategoryTree[] {
  const map = new Map<number, CategoryTree>();
  const roots: CategoryTree[] = [];

  for (const cat of categories) {
    map.set(cat.id, { ...cat, children: [] });
  }
  for (const cat of categories) {
    const node = map.get(cat.id)!;
    if (cat.parent_id && map.has(cat.parent_id)) {
      map.get(cat.parent_id)!.children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}

export async function getCategoryBySlug(env: Env, slug: string): Promise<CategoryRow | null> {
  return env.DB.prepare('SELECT * FROM categories WHERE slug = ?').bind(slug).first<CategoryRow>();
}

export async function getCategoryById(env: Env, id: number): Promise<CategoryRow | null> {
  return env.DB.prepare('SELECT * FROM categories WHERE id = ?').bind(id).first<CategoryRow>();
}

export async function createCategory(env: Env, data: { name: string; slug: string; description?: string; parent_id?: number | null; sort_order?: number }): Promise<CategoryRow> {
  const result = await env.DB.prepare(
    'INSERT INTO categories (name, slug, description, parent_id, sort_order) VALUES (?, ?, ?, ?, ?) RETURNING *'
  ).bind(data.name, data.slug, data.description || '', data.parent_id ?? null, data.sort_order ?? 0).first<CategoryRow>();
  await invalidateCategoryCaches(env);
  return result!;
}

export async function updateCategory(env: Env, id: number, data: { name?: string; slug?: string; description?: string; parent_id?: number | null; sort_order?: number }): Promise<CategoryRow | null> {
  const old = await getCategoryById(env, id);
  if (!old) return null;
  const name = data.name ?? old.name;
  const slug = data.slug ?? old.slug;
  const description = data.description ?? old.description;
  const parent_id = data.parent_id !== undefined ? data.parent_id : old.parent_id;
  const sort_order = data.sort_order ?? old.sort_order;

  const result = await env.DB.prepare(
    'UPDATE categories SET name=?, slug=?, description=?, parent_id=?, sort_order=? WHERE id=? RETURNING *'
  ).bind(name, slug, description, parent_id, sort_order, id).first<CategoryRow>();
  await invalidateCategoryCaches(env, old.slug);
  if (slug !== old.slug) await invalidateCategoryCaches(env, slug);
  return result;
}

export async function deleteCategory(env: Env, id: number): Promise<boolean> {
  const old = await getCategoryById(env, id);
  if (!old) return false;
  await env.DB.prepare('DELETE FROM categories WHERE id = ?').bind(id).run();
  await invalidateCategoryCaches(env, old.slug);
  return true;
}

export async function getCategoryArticleCount(env: Env, categoryId: number): Promise<number> {
  const row = await env.DB.prepare(
    'SELECT COUNT(*) as count FROM article_categories ac JOIN articles a ON a.id = ac.article_id WHERE ac.category_id = ? AND a.status = \'published\''
  ).bind(categoryId).first<{ count: number }>();
  return row?.count ?? 0;
}
