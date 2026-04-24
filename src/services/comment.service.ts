// Comment service: CRUD + moderation
import type { Env, CommentRow } from '../env';
import { invalidateCommentCaches } from './cache.service';

export async function getApprovedComments(env: Env, articleId: number): Promise<CommentRow[]> {
  const rows = await env.DB.prepare(
    "SELECT * FROM comments WHERE article_id = ? AND status = 'approved' ORDER BY created_at ASC"
  ).bind(articleId).all<CommentRow>();
  return rows.results || [];
}

export async function getAllComments(
  env: Env,
  status?: string,
  page = 1,
  pageSize = 20
): Promise<{ comments: (CommentRow & { article_title?: string; article_slug?: string })[]; total: number }> {
  let where = '1=1';
  const binds: any[] = [];
  if (status) { where += ' AND c.status = ?'; binds.push(status); }

  const countRow = await env.DB.prepare(`SELECT COUNT(*) as total FROM comments c WHERE ${where}`)
    .bind(...binds).first<{ total: number }>();
  const total = countRow?.total ?? 0;
  const offset = (Math.max(1, page) - 1) * pageSize;

  const rows = await env.DB.prepare(
    `SELECT c.*, a.title as article_title, a.slug as article_slug
     FROM comments c LEFT JOIN articles a ON a.id = c.article_id
     WHERE ${where} ORDER BY c.created_at DESC LIMIT ? OFFSET ?`
  ).bind(...binds, pageSize, offset).all<CommentRow & { article_title?: string; article_slug?: string }>();

  return { comments: rows.results || [], total };
}

export async function createComment(
  env: Env,
  data: { article_id: number; nickname: string; email: string; content: string; parent_id?: number; ip_address?: string }
): Promise<CommentRow> {
  const row = await env.DB.prepare(
    'INSERT INTO comments (article_id, parent_id, nickname, email, content, ip_address) VALUES (?, ?, ?, ?, ?, ?) RETURNING *'
  ).bind(data.article_id, data.parent_id ?? null, data.nickname, data.email, data.content, data.ip_address || '').first<CommentRow>();
  // Update comment count
  await env.DB.prepare(
    "UPDATE articles SET comment_count = (SELECT COUNT(*) FROM comments WHERE article_id = ? AND status = 'approved') WHERE id = ?"
  ).bind(data.article_id, data.article_id).run();
  return row!;
}

export async function approveComment(env: Env, id: number): Promise<CommentRow | null> {
  const row = await env.DB.prepare(
    "UPDATE comments SET status = 'approved' WHERE id = ? RETURNING *"
  ).bind(id).first<CommentRow>();
  if (row) {
    await env.DB.prepare(
      "UPDATE articles SET comment_count = (SELECT COUNT(*) FROM comments WHERE article_id = ? AND status = 'approved') WHERE id = ?"
    ).bind(row.article_id, row.article_id).run();
    // Invalidate article page cache
    const article = await env.DB.prepare('SELECT slug FROM articles WHERE id = ?').bind(row.article_id).first<{ slug: string }>();
    if (article) await invalidateCommentCaches(env, article.slug);
  }
  return row;
}

export async function rejectComment(env: Env, id: number): Promise<CommentRow | null> {
  return env.DB.prepare("UPDATE comments SET status = 'rejected' WHERE id = ? RETURNING *").bind(id).first<CommentRow>();
}

export async function deleteComment(env: Env, id: number): Promise<boolean> {
  const old = await env.DB.prepare('SELECT article_id FROM comments WHERE id = ?').bind(id).first<{ article_id: number }>();
  if (!old) return false;
  await env.DB.prepare('DELETE FROM comments WHERE id = ?').bind(id).run();
  await env.DB.prepare(
    "UPDATE articles SET comment_count = (SELECT COUNT(*) FROM comments WHERE article_id = ? AND status = 'approved') WHERE id = ?"
  ).bind(old.article_id, old.article_id).run();
  const article = await env.DB.prepare('SELECT slug FROM articles WHERE id = ?').bind(old.article_id).first<{ slug: string }>();
  if (article) await invalidateCommentCaches(env, article.slug);
  return true;
}
