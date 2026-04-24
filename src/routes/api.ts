// API routes: /api/*
import { Hono } from 'hono';
import type { Env } from '../env';
import { requireAuth, optionalAuth } from '../middleware/auth';
import * as authService from '../services/auth.service';
import * as articleService from '../services/article.service';
import * as categoryService from '../services/category.service';
import * as tagService from '../services/tag.service';
import * as commentService from '../services/comment.service';
import * as settingsService from '../services/settings.service';
import { verifyJwt } from '../utils/jwt';

type ApiEnv = { Bindings: Env; Variables: { adminId: number; username: string } };
export const apiRoutes = new Hono<ApiEnv>();

// ==================== Auth ====================
apiRoutes.post('/auth/login', async (c) => {
  const body = await c.req.json<{ username: string; password: string }>();
  if (!body.username || !body.password) {
    return c.json({ success: false, error: { code: 'BAD_REQUEST', message: 'Username and password required' } }, 400);
  }
  const result = await authService.login(c.env, body.username, body.password);
  if (!result) {
    return c.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid credentials' } }, 401);
  }
  // Set refresh token as httpOnly cookie
  c.header('Set-Cookie', `refresh_token=${result.refreshToken}; HttpOnly; Secure; SameSite=Strict; Path=/api/auth/refresh; Max-Age=604800`);
  return c.json({ success: true, data: { accessToken: result.accessToken, admin: result.admin } });
});

apiRoutes.post('/auth/refresh', async (c) => {
  const cookie = c.req.header('Cookie') || '';
  const match = cookie.match(/refresh_token=([^;]+)/);
  if (!match) {
    return c.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'No refresh token' } }, 401);
  }
  const payload = await verifyJwt(match[1], c.env.JWT_SECRET);
  if (!payload || payload.type !== 'refresh') {
    return c.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid refresh token' } }, 401);
  }
  const tokens = await authService.refreshAccessToken(c.env, payload.sub, payload.username);
  c.header('Set-Cookie', `refresh_token=${tokens.refreshToken}; HttpOnly; Secure; SameSite=Strict; Path=/api/auth/refresh; Max-Age=604800`);
  return c.json({ success: true, data: { accessToken: tokens.accessToken } });
});

apiRoutes.get('/auth/me', requireAuth, async (c) => {
  const admin = await authService.getAdmin(c.env, c.get('adminId'));
  if (!admin) return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Admin not found' } }, 404);
  return c.json({ success: true, data: admin });
});

// ==================== Articles ====================
apiRoutes.get('/articles', optionalAuth, async (c) => {
  const page = parseInt(c.req.query('page') || '1', 10);
  const pageSize = parseInt(c.req.query('pageSize') || '10', 10);
  const status = c.req.query('status');
  const isAdmin = !!c.get('adminId');

  if (isAdmin) {
    const result = await articleService.getAllArticles(c.env, page, pageSize, status || undefined);
    return c.json({ success: true, data: result.articles, pagination: result.pagination });
  }
  const result = await articleService.getPublishedArticles(c.env, page, pageSize);
  return c.json({ success: true, data: result.articles, pagination: result.pagination });
});

apiRoutes.post('/articles', requireAuth, async (c) => {
  const body = await c.req.json();
  if (!body.title || !body.content_md) {
    return c.json({ success: false, error: { code: 'BAD_REQUEST', message: 'Title and content required' } }, 400);
  }
  const article = await articleService.createArticle(c.env, body);
  return c.json({ success: true, data: article }, 201);
});

apiRoutes.get('/articles/:id', async (c) => {
  const id = parseInt(c.req.param('id'), 10);
  const article = await articleService.getArticleById(c.env, id);
  if (!article) return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Article not found' } }, 404);
  return c.json({ success: true, data: article });
});

apiRoutes.put('/articles/:id', requireAuth, async (c) => {
  const id = parseInt(c.req.param('id'), 10);
  const body = await c.req.json();
  const article = await articleService.updateArticle(c.env, id, body);
  if (!article) return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Article not found' } }, 404);
  return c.json({ success: true, data: article });
});

apiRoutes.delete('/articles/:id', requireAuth, async (c) => {
  const id = parseInt(c.req.param('id'), 10);
  const ok = await articleService.deleteArticle(c.env, id);
  if (!ok) return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Article not found' } }, 404);
  return c.json({ success: true, data: null });
});

apiRoutes.post('/articles/:id/publish', requireAuth, async (c) => {
  const id = parseInt(c.req.param('id'), 10);
  const article = await articleService.publishArticle(c.env, id);
  if (!article) return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Article not found' } }, 404);
  return c.json({ success: true, data: article });
});

apiRoutes.post('/articles/:id/unpublish', requireAuth, async (c) => {
  const id = parseInt(c.req.param('id'), 10);
  const article = await articleService.unpublishArticle(c.env, id);
  if (!article) return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Article not found' } }, 404);
  return c.json({ success: true, data: article });
});

apiRoutes.get('/articles/:id/versions', requireAuth, async (c) => {
  const id = parseInt(c.req.param('id'), 10);
  const versions = await articleService.getArticleVersions(c.env, id);
  return c.json({ success: true, data: versions });
});

// ==================== Comments ====================
apiRoutes.get('/articles/:id/comments', async (c) => {
  const id = parseInt(c.req.param('id'), 10);
  const comments = await commentService.getApprovedComments(c.env, id);
  return c.json({ success: true, data: comments });
});

apiRoutes.post('/articles/:id/comments', async (c) => {
  const articleId = parseInt(c.req.param('id'), 10);
  const body = await c.req.json<{ nickname: string; email: string; content: string; parent_id?: number }>();
  if (!body.nickname || !body.email || !body.content) {
    return c.json({ success: false, error: { code: 'BAD_REQUEST', message: 'Nickname, email and content required' } }, 400);
  }
  if (body.content.length > 2000) {
    return c.json({ success: false, error: { code: 'BAD_REQUEST', message: 'Comment too long (max 2000 chars)' } }, 400);
  }
  const ip = c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For') || '';
  const comment = await commentService.createComment(c.env, { ...body, article_id: articleId, ip_address: ip });
  return c.json({ success: true, data: comment }, 201);
});

apiRoutes.post('/articles/:id/like', async (c) => {
  const articleId = parseInt(c.req.param('id'), 10);
  const ip = c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For') || 'unknown';
  const ipHash = await hashIp(ip);
  try {
    await c.env.DB.prepare('INSERT INTO likes (article_id, ip_hash) VALUES (?, ?)').bind(articleId, ipHash).run();
    await c.env.DB.prepare('UPDATE articles SET like_count = like_count + 1 WHERE id = ?').bind(articleId).run();
    return c.json({ success: true, data: { liked: true } });
  } catch {
    return c.json({ success: true, data: { liked: false, message: 'Already liked' } });
  }
});

// Admin comment management
apiRoutes.get('/comments', requireAuth, async (c) => {
  const status = c.req.query('status');
  const page = parseInt(c.req.query('page') || '1', 10);
  const result = await commentService.getAllComments(c.env, status || undefined, page);
  return c.json({ success: true, data: result.comments, total: result.total });
});

apiRoutes.post('/comments/:id/approve', requireAuth, async (c) => {
  const id = parseInt(c.req.param('id'), 10);
  const comment = await commentService.approveComment(c.env, id);
  if (!comment) return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Comment not found' } }, 404);
  return c.json({ success: true, data: comment });
});

apiRoutes.post('/comments/:id/reject', requireAuth, async (c) => {
  const id = parseInt(c.req.param('id'), 10);
  const comment = await commentService.rejectComment(c.env, id);
  if (!comment) return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Comment not found' } }, 404);
  return c.json({ success: true, data: comment });
});

apiRoutes.delete('/comments/:id', requireAuth, async (c) => {
  const id = parseInt(c.req.param('id'), 10);
  const ok = await commentService.deleteComment(c.env, id);
  if (!ok) return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Comment not found' } }, 404);
  return c.json({ success: true, data: null });
});

// ==================== Categories ====================
apiRoutes.get('/categories', async (c) => {
  const categories = await categoryService.getCategories(c.env);
  const tree = categoryService.buildCategoryTree(categories);
  return c.json({ success: true, data: tree });
});

apiRoutes.post('/categories', requireAuth, async (c) => {
  const body = await c.req.json<{ name: string; slug: string; description?: string; parent_id?: number; sort_order?: number }>();
  if (!body.name || !body.slug) {
    return c.json({ success: false, error: { code: 'BAD_REQUEST', message: 'Name and slug required' } }, 400);
  }
  const category = await categoryService.createCategory(c.env, body);
  return c.json({ success: true, data: category }, 201);
});

apiRoutes.put('/categories/:id', requireAuth, async (c) => {
  const id = parseInt(c.req.param('id'), 10);
  const body = await c.req.json();
  const category = await categoryService.updateCategory(c.env, id, body);
  if (!category) return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Category not found' } }, 404);
  return c.json({ success: true, data: category });
});

apiRoutes.delete('/categories/:id', requireAuth, async (c) => {
  const id = parseInt(c.req.param('id'), 10);
  const ok = await categoryService.deleteCategory(c.env, id);
  if (!ok) return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Category not found' } }, 404);
  return c.json({ success: true, data: null });
});

// ==================== Tags ====================
apiRoutes.get('/tags', async (c) => {
  const tags = await tagService.getTagsWithCounts(c.env);
  return c.json({ success: true, data: tags });
});

apiRoutes.post('/tags', requireAuth, async (c) => {
  const body = await c.req.json<{ name: string; slug: string }>();
  if (!body.name || !body.slug) {
    return c.json({ success: false, error: { code: 'BAD_REQUEST', message: 'Name and slug required' } }, 400);
  }
  const tag = await tagService.createTag(c.env, body);
  return c.json({ success: true, data: tag }, 201);
});

apiRoutes.put('/tags/:id', requireAuth, async (c) => {
  const id = parseInt(c.req.param('id'), 10);
  const body = await c.req.json();
  const tag = await tagService.updateTag(c.env, id, body);
  if (!tag) return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Tag not found' } }, 404);
  return c.json({ success: true, data: tag });
});

apiRoutes.delete('/tags/:id', requireAuth, async (c) => {
  const id = parseInt(c.req.param('id'), 10);
  const ok = await tagService.deleteTag(c.env, id);
  if (!ok) return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Tag not found' } }, 404);
  return c.json({ success: true, data: null });
});

// ==================== Settings ====================
apiRoutes.get('/settings', async (c) => {
  const settings = await settingsService.getSettings(c.env);
  return c.json({ success: true, data: settings });
});

apiRoutes.put('/settings', requireAuth, async (c) => {
  const body = await c.req.json();
  const settings = await settingsService.updateSettings(c.env, body);
  return c.json({ success: true, data: settings });
});

// ==================== Analytics ====================
apiRoutes.get('/analytics/overview', requireAuth, async (c) => {
  const [articles, comments, reads, likes] = await Promise.all([
    c.env.DB.prepare('SELECT COUNT(*) as count FROM articles').first<{ count: number }>(),
    c.env.DB.prepare("SELECT COUNT(*) as count FROM comments WHERE status = 'pending'").first<{ count: number }>(),
    c.env.DB.prepare('SELECT SUM(read_count) as total FROM articles').first<{ total: number }>(),
    c.env.DB.prepare('SELECT SUM(like_count) as total FROM articles').first<{ total: number }>(),
  ]);
  return c.json({
    success: true,
    data: {
      total_articles: articles?.count ?? 0,
      pending_comments: comments?.count ?? 0,
      total_reads: reads?.total ?? 0,
      total_likes: likes?.total ?? 0,
    },
  });
});

apiRoutes.get('/analytics/popular', requireAuth, async (c) => {
  const rows = await c.env.DB.prepare(
    "SELECT id, title, slug, read_count, like_count FROM articles WHERE status='published' ORDER BY read_count DESC LIMIT 10"
  ).all();
  return c.json({ success: true, data: rows.results || [] });
});

// Helper: hash IP for like dedup
async function hashIp(ip: string): Promise<string> {
  const data = new TextEncoder().encode(ip);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, '0')).join('');
}
