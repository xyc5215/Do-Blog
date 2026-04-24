// Article service: CRUD + versioning + associations
import type { Env, ArticleRow, ArticleWithMeta, CategoryRow, TagRow, ArticleVersionRow, Pagination } from '../env';
import { renderMarkdown } from '../utils/markdown';
import { generateSlug } from '../utils/slug';
import { calcPagination, getOffset } from '../utils/pagination';
import { invalidateArticleCaches } from './cache.service';

// Get published articles with pagination
export async function getPublishedArticles(
  env: Env,
  page: number,
  pageSize: number
): Promise<{ articles: ArticleWithMeta[]; pagination: Pagination }> {
  const countRow = await env.DB.prepare(
    "SELECT COUNT(*) as total FROM articles WHERE status = 'published'"
  ).first<{ total: number }>();
  const total = countRow?.total ?? 0;
  const pagination = calcPagination(total, page, pageSize);
  const offset = getOffset(pagination.page, pageSize);

  const rows = await env.DB.prepare(
    "SELECT * FROM articles WHERE status = 'published' ORDER BY published_at DESC LIMIT ? OFFSET ?"
  ).bind(pageSize, offset).all<ArticleRow>();

  const articles = await Promise.all(
    (rows.results || []).map((a) => attachMeta(env, a))
  );
  return { articles, pagination };
}

// Get all articles (admin) with pagination
export async function getAllArticles(
  env: Env,
  page: number,
  pageSize: number,
  status?: string
): Promise<{ articles: ArticleWithMeta[]; pagination: Pagination }> {
  let where = '1=1';
  const binds: any[] = [];
  if (status) {
    where += ' AND status = ?';
    binds.push(status);
  }
  const countRow = await env.DB.prepare(`SELECT COUNT(*) as total FROM articles WHERE ${where}`)
    .bind(...binds).first<{ total: number }>();
  const total = countRow?.total ?? 0;
  const pagination = calcPagination(total, page, pageSize);
  const offset = getOffset(pagination.page, pageSize);

  const rows = await env.DB.prepare(
    `SELECT * FROM articles WHERE ${where} ORDER BY updated_at DESC LIMIT ? OFFSET ?`
  ).bind(...binds, pageSize, offset).all<ArticleRow>();

  const articles = await Promise.all(
    (rows.results || []).map((a) => attachMeta(env, a))
  );
  return { articles, pagination };
}

// Get article by slug
export async function getArticleBySlug(env: Env, slug: string): Promise<ArticleWithMeta | null> {
  const row = await env.DB.prepare('SELECT * FROM articles WHERE slug = ?').bind(slug).first<ArticleRow>();
  if (!row) return null;
  return attachMeta(env, row);
}

// Get article by ID
export async function getArticleById(env: Env, id: number): Promise<ArticleWithMeta | null> {
  const row = await env.DB.prepare('SELECT * FROM articles WHERE id = ?').bind(id).first<ArticleRow>();
  if (!row) return null;
  return attachMeta(env, row);
}

// Create article
export async function createArticle(
  env: Env,
  data: {
    title: string;
    content_md: string;
    slug?: string;
    excerpt?: string;
    cover_image?: string;
    status?: string;
    category_ids?: number[];
    tag_ids?: number[];
  }
): Promise<ArticleWithMeta> {
  const slug = data.slug || generateSlug(data.title);
  const md = renderMarkdown(data.content_md);
  const status = data.status || 'draft';
  const published_at = status === 'published' ? new Date().toISOString() : null;

  const row = await env.DB.prepare(
    `INSERT INTO articles (title, slug, content_md, content_html, excerpt, cover_image, status, published_at, reading_time)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *`
  ).bind(
    data.title, slug, data.content_md, md.html,
    data.excerpt || md.excerpt, data.cover_image || '', status,
    published_at, md.readingTime
  ).first<ArticleRow>();

  const article = row!;

  // Save first version
  await env.DB.prepare(
    'INSERT INTO article_versions (article_id, title, content_md, version_num, change_note) VALUES (?, ?, ?, 1, ?)'
  ).bind(article.id, data.title, data.content_md, 'Initial version').run();

  // Attach categories and tags
  await syncCategories(env, article.id, data.category_ids || []);
  await syncTags(env, article.id, data.tag_ids || []);

  await invalidateArticleCaches(env);
  return attachMeta(env, article);
}

// Update article
export async function updateArticle(
  env: Env,
  id: number,
  data: {
    title?: string;
    content_md?: string;
    slug?: string;
    excerpt?: string;
    cover_image?: string;
    category_ids?: number[];
    tag_ids?: number[];
    change_note?: string;
  }
): Promise<ArticleWithMeta | null> {
  const old = await env.DB.prepare('SELECT * FROM articles WHERE id = ?').bind(id).first<ArticleRow>();
  if (!old) return null;

  const title = data.title ?? old.title;
  const content_md = data.content_md ?? old.content_md;
  const slug = data.slug ?? old.slug;
  const cover_image = data.cover_image ?? old.cover_image;

  const md = renderMarkdown(content_md);
  const excerpt = data.excerpt ?? md.excerpt;

  const row = await env.DB.prepare(
    `UPDATE articles SET title=?, slug=?, content_md=?, content_html=?, excerpt=?, cover_image=?, reading_time=?, updated_at=datetime('now')
     WHERE id=? RETURNING *`
  ).bind(title, slug, content_md, md.html, excerpt, cover_image, md.readingTime, id).first<ArticleRow>();

  // Save version if content changed
  if (data.content_md || data.title) {
    const lastVersion = await env.DB.prepare(
      'SELECT MAX(version_num) as max_v FROM article_versions WHERE article_id = ?'
    ).bind(id).first<{ max_v: number }>();
    const nextVersion = (lastVersion?.max_v ?? 0) + 1;
    await env.DB.prepare(
      'INSERT INTO article_versions (article_id, title, content_md, version_num, change_note) VALUES (?, ?, ?, ?, ?)'
    ).bind(id, title, content_md, nextVersion, data.change_note || '').run();
  }

  if (data.category_ids !== undefined) await syncCategories(env, id, data.category_ids);
  if (data.tag_ids !== undefined) await syncTags(env, id, data.tag_ids);

  await invalidateArticleCaches(env, old.slug);
  if (slug !== old.slug) await invalidateArticleCaches(env, slug);
  return attachMeta(env, row!);
}

// Publish article
export async function publishArticle(env: Env, id: number): Promise<ArticleWithMeta | null> {
  const row = await env.DB.prepare(
    "UPDATE articles SET status='published', published_at=COALESCE(published_at, datetime('now')), updated_at=datetime('now') WHERE id=? RETURNING *"
  ).bind(id).first<ArticleRow>();
  if (!row) return null;
  await invalidateArticleCaches(env, row.slug);
  return attachMeta(env, row);
}

// Unpublish article
export async function unpublishArticle(env: Env, id: number): Promise<ArticleWithMeta | null> {
  const row = await env.DB.prepare(
    "UPDATE articles SET status='draft', updated_at=datetime('now') WHERE id=? RETURNING *"
  ).bind(id).first<ArticleRow>();
  if (!row) return null;
  await invalidateArticleCaches(env, row.slug);
  return attachMeta(env, row);
}

// Delete article
export async function deleteArticle(env: Env, id: number): Promise<boolean> {
  const old = await env.DB.prepare('SELECT slug FROM articles WHERE id = ?').bind(id).first<{ slug: string }>();
  if (!old) return false;
  await env.DB.prepare('DELETE FROM articles WHERE id = ?').bind(id).run();
  await invalidateArticleCaches(env, old.slug);
  return true;
}

// Get article versions
export async function getArticleVersions(env: Env, articleId: number): Promise<ArticleVersionRow[]> {
  const rows = await env.DB.prepare(
    'SELECT * FROM article_versions WHERE article_id = ? ORDER BY version_num DESC'
  ).bind(articleId).all<ArticleVersionRow>();
  return rows.results || [];
}

// Get articles by category
export async function getArticlesByCategory(
  env: Env, categoryId: number, page: number, pageSize: number
): Promise<{ articles: ArticleWithMeta[]; pagination: Pagination }> {
  const countRow = await env.DB.prepare(
    "SELECT COUNT(*) as total FROM article_categories ac JOIN articles a ON a.id=ac.article_id WHERE ac.category_id=? AND a.status='published'"
  ).bind(categoryId).first<{ total: number }>();
  const total = countRow?.total ?? 0;
  const pagination = calcPagination(total, page, pageSize);
  const offset = getOffset(pagination.page, pageSize);

  const rows = await env.DB.prepare(
    "SELECT a.* FROM article_categories ac JOIN articles a ON a.id=ac.article_id WHERE ac.category_id=? AND a.status='published' ORDER BY a.published_at DESC LIMIT ? OFFSET ?"
  ).bind(categoryId, pageSize, offset).all<ArticleRow>();

  const articles = await Promise.all((rows.results || []).map((a) => attachMeta(env, a)));
  return { articles, pagination };
}

// Get articles by tag
export async function getArticlesByTag(
  env: Env, tagId: number, page: number, pageSize: number
): Promise<{ articles: ArticleWithMeta[]; pagination: Pagination }> {
  const countRow = await env.DB.prepare(
    "SELECT COUNT(*) as total FROM article_tags at2 JOIN articles a ON a.id=at2.article_id WHERE at2.tag_id=? AND a.status='published'"
  ).bind(tagId).first<{ total: number }>();
  const total = countRow?.total ?? 0;
  const pagination = calcPagination(total, page, pageSize);
  const offset = getOffset(pagination.page, pageSize);

  const rows = await env.DB.prepare(
    "SELECT a.* FROM article_tags at2 JOIN articles a ON a.id=at2.article_id WHERE at2.tag_id=? AND a.status='published' ORDER BY a.published_at DESC LIMIT ? OFFSET ?"
  ).bind(tagId, pageSize, offset).all<ArticleRow>();

  const articles = await Promise.all((rows.results || []).map((a) => attachMeta(env, a)));
  return { articles, pagination };
}

// Search articles
export async function searchArticles(
  env: Env, query: string, page: number, pageSize: number
): Promise<{ articles: ArticleWithMeta[]; pagination: Pagination }> {
  const likeQ = `%${query}%`;
  const countRow = await env.DB.prepare(
    "SELECT COUNT(*) as total FROM articles WHERE status='published' AND (title LIKE ? OR content_md LIKE ?)"
  ).bind(likeQ, likeQ).first<{ total: number }>();
  const total = countRow?.total ?? 0;
  const pagination = calcPagination(total, page, pageSize);
  const offset = getOffset(pagination.page, pageSize);

  const rows = await env.DB.prepare(
    "SELECT * FROM articles WHERE status='published' AND (title LIKE ? OR content_md LIKE ?) ORDER BY published_at DESC LIMIT ? OFFSET ?"
  ).bind(likeQ, likeQ, pageSize, offset).all<ArticleRow>();

  const articles = await Promise.all((rows.results || []).map((a) => attachMeta(env, a)));
  return { articles, pagination };
}

// Get all published articles for archive
export async function getArchiveArticles(env: Env): Promise<ArticleRow[]> {
  const rows = await env.DB.prepare(
    "SELECT id, title, slug, published_at, status FROM articles WHERE status='published' ORDER BY published_at DESC"
  ).all<ArticleRow>();
  return rows.results || [];
}

// Get hot/popular articles
export async function getHotArticles(env: Env, limit = 5): Promise<ArticleRow[]> {
  const cached = await env.BLOG_KV.get('hot:articles', 'json');
  if (cached) return cached as ArticleRow[];

  const rows = await env.DB.prepare(
    "SELECT id, title, slug, read_count, like_count FROM articles WHERE status='published' ORDER BY read_count DESC LIMIT ?"
  ).bind(limit).all<ArticleRow>();
  const result = rows.results || [];
  await env.BLOG_KV.put('hot:articles', JSON.stringify(result), { expirationTtl: 900 });
  return result;
}

// Get prev/next articles
export async function getAdjacentArticles(env: Env, publishedAt: string): Promise<{ prev: ArticleRow | null; next: ArticleRow | null }> {
  const prev = await env.DB.prepare(
    "SELECT id, title, slug FROM articles WHERE status='published' AND published_at < ? ORDER BY published_at DESC LIMIT 1"
  ).bind(publishedAt).first<ArticleRow>();
  const next = await env.DB.prepare(
    "SELECT id, title, slug FROM articles WHERE status='published' AND published_at > ? ORDER BY published_at ASC LIMIT 1"
  ).bind(publishedAt).first<ArticleRow>();
  return { prev: prev ?? null, next: next ?? null };
}

// Increment read count via KV buffer
export async function incrementReadCount(env: Env, articleId: number): Promise<void> {
  const key = `counter:article:${articleId}`;
  const current = await env.BLOG_KV.get(key);
  const count = current ? parseInt(current, 10) + 1 : 1;
  await env.BLOG_KV.put(key, count.toString(), { expirationTtl: 300 });
}

// Helper: attach categories and tags to article
async function attachMeta(env: Env, article: ArticleRow): Promise<ArticleWithMeta> {
  const [catRows, tagRows] = await Promise.all([
    env.DB.prepare(
      'SELECT c.* FROM categories c JOIN article_categories ac ON ac.category_id=c.id WHERE ac.article_id=?'
    ).bind(article.id).all<CategoryRow>(),
    env.DB.prepare(
      'SELECT t.* FROM tags t JOIN article_tags at2 ON at2.tag_id=t.id WHERE at2.article_id=?'
    ).bind(article.id).all<TagRow>(),
  ]);
  return {
    ...article,
    categories: catRows.results || [],
    tags: tagRows.results || [],
  };
}

// Helper: sync article-category associations
async function syncCategories(env: Env, articleId: number, categoryIds: number[]): Promise<void> {
  await env.DB.prepare('DELETE FROM article_categories WHERE article_id = ?').bind(articleId).run();
  for (const catId of categoryIds) {
    await env.DB.prepare('INSERT OR IGNORE INTO article_categories (article_id, category_id) VALUES (?, ?)').bind(articleId, catId).run();
  }
}

// Helper: sync article-tag associations
async function syncTags(env: Env, articleId: number, tagIds: number[]): Promise<void> {
  await env.DB.prepare('DELETE FROM article_tags WHERE article_id = ?').bind(articleId).run();
  for (const tagId of tagIds) {
    await env.DB.prepare('INSERT OR IGNORE INTO article_tags (article_id, tag_id) VALUES (?, ?)').bind(articleId, tagId).run();
  }
}
