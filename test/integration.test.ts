// Integration tests: full HTTP request/response through Hono app
import { describe, it, expect, beforeAll } from 'vitest';
import { env } from 'cloudflare:test';
import { Hono } from 'hono';
import type { Env } from '../src/env';
import { apiRoutes } from '../src/routes/api';
import { publicRoutes } from '../src/routes/public';

// Build a test app
const app = new Hono<{ Bindings: Env }>();
app.route('/api', apiRoutes);
app.route('/', publicRoutes);

function req(method: string, path: string, body?: any, headers?: Record<string, string>) {
  const init: RequestInit = { method, headers: { ...headers } };
  if (body) {
    init.body = JSON.stringify(body);
    (init.headers as Record<string, string>)['Content-Type'] = 'application/json';
  }
  return app.request(path, init, env);
}

// Setup DB schema
beforeAll(async () => {
  await env.DB.exec(`
    CREATE TABLE IF NOT EXISTS admin (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      display_name TEXT NOT NULL,
      avatar_url TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      content_md TEXT NOT NULL,
      content_html TEXT NOT NULL,
      excerpt TEXT DEFAULT '',
      cover_image TEXT DEFAULT '',
      status TEXT NOT NULL DEFAULT 'draft',
      published_at TEXT,
      read_count INTEGER NOT NULL DEFAULT 0,
      like_count INTEGER NOT NULL DEFAULT 0,
      comment_count INTEGER NOT NULL DEFAULT 0,
      reading_time INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT DEFAULT '',
      parent_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      slug TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS article_categories (
      article_id INTEGER NOT NULL,
      category_id INTEGER NOT NULL,
      PRIMARY KEY (article_id, category_id)
    );
    CREATE TABLE IF NOT EXISTS article_tags (
      article_id INTEGER NOT NULL,
      tag_id INTEGER NOT NULL,
      PRIMARY KEY (article_id, tag_id)
    );
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      article_id INTEGER NOT NULL,
      parent_id INTEGER,
      nickname TEXT NOT NULL,
      email TEXT NOT NULL,
      content TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      ip_address TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS article_versions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      article_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      content_md TEXT NOT NULL,
      version_num INTEGER NOT NULL,
      change_note TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(article_id, version_num)
    );
    CREATE TABLE IF NOT EXISTS likes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      article_id INTEGER NOT NULL,
      ip_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(article_id, ip_hash)
    );
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // Seed admin with placeholder
  await env.DB.prepare(
    "INSERT OR IGNORE INTO admin (username, password_hash, display_name) VALUES ('admin', 'pbkdf2:100000:aabb:placeholder_hash_replace_on_first_run', 'Admin')"
  ).run();

  // Seed a category
  await env.DB.prepare(
    "INSERT OR IGNORE INTO categories (name, slug, description, sort_order) VALUES ('Tech', 'tech', 'Technology', 0)"
  ).run();
});

let accessToken = '';

// ===================== Auth =====================
describe('Auth API', () => {
  it('POST /api/auth/login - first run sets password and logs in', async () => {
    const res = await req('POST', '/api/auth/login', { username: 'admin', password: 'testpass123' });
    const data = await res.json() as any;
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.accessToken).toBeDefined();
    expect(data.data.admin.username).toBe('admin');
    accessToken = data.data.accessToken;
  });

  it('POST /api/auth/login - subsequent login works', async () => {
    const res = await req('POST', '/api/auth/login', { username: 'admin', password: 'testpass123' });
    const data = await res.json() as any;
    expect(data.success).toBe(true);
    accessToken = data.data.accessToken;
  });

  it('POST /api/auth/login - wrong password fails', async () => {
    const res = await req('POST', '/api/auth/login', { username: 'admin', password: 'wrongpass' });
    const data = await res.json() as any;
    expect(res.status).toBe(401);
    expect(data.success).toBe(false);
  });

  it('POST /api/auth/login - missing fields fails', async () => {
    const res = await req('POST', '/api/auth/login', { username: 'admin' });
    const data = await res.json() as any;
    expect(res.status).toBe(400);
    expect(data.success).toBe(false);
  });

  it('GET /api/auth/me - valid token', async () => {
    const res = await req('GET', '/api/auth/me', undefined, { Authorization: `Bearer ${accessToken}` });
    const data = await res.json() as any;
    expect(data.success).toBe(true);
    expect(data.data.username).toBe('admin');
  });

  it('GET /api/auth/me - missing token returns 401', async () => {
    const res = await req('GET', '/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('GET /api/auth/me - invalid token returns 401', async () => {
    const res = await req('GET', '/api/auth/me', undefined, { Authorization: 'Bearer invalid.token.here' });
    expect(res.status).toBe(401);
  });
});

// ===================== Categories =====================
describe('Categories API', () => {
  it('GET /api/categories - returns list', async () => {
    const res = await req('GET', '/api/categories');
    const data = await res.json() as any;
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
  });

  it('POST /api/categories - requires auth', async () => {
    const res = await req('POST', '/api/categories', { name: 'New', slug: 'new' });
    expect(res.status).toBe(401);
  });

  it('POST /api/categories - creates category', async () => {
    const res = await req('POST', '/api/categories', { name: 'Science', slug: 'science', description: 'Science posts' }, { Authorization: `Bearer ${accessToken}` });
    const data = await res.json() as any;
    expect(res.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.data.name).toBe('Science');
  });

  it('POST /api/categories - missing fields fails', async () => {
    const res = await req('POST', '/api/categories', { name: 'No Slug' }, { Authorization: `Bearer ${accessToken}` });
    const data = await res.json() as any;
    expect(res.status).toBe(400);
  });

  it('PUT /api/categories/:id - updates category', async () => {
    const res = await req('PUT', '/api/categories/2', { name: 'Science Updated' }, { Authorization: `Bearer ${accessToken}` });
    const data = await res.json() as any;
    expect(data.success).toBe(true);
    expect(data.data.name).toBe('Science Updated');
  });

  it('DELETE /api/categories/:id - deletes', async () => {
    const res = await req('DELETE', '/api/categories/2', undefined, { Authorization: `Bearer ${accessToken}` });
    const data = await res.json() as any;
    expect(data.success).toBe(true);
  });
});

// ===================== Tags =====================
describe('Tags API', () => {
  it('POST /api/tags - creates tag', async () => {
    const res = await req('POST', '/api/tags', { name: 'JavaScript', slug: 'javascript' }, { Authorization: `Bearer ${accessToken}` });
    const data = await res.json() as any;
    expect(res.status).toBe(201);
    expect(data.data.name).toBe('JavaScript');
  });

  it('GET /api/tags - returns tags with counts', async () => {
    const res = await req('GET', '/api/tags');
    const data = await res.json() as any;
    expect(data.success).toBe(true);
    expect(data.data.length).toBeGreaterThanOrEqual(1);
  });

  it('PUT /api/tags/:id - updates', async () => {
    const res = await req('PUT', '/api/tags/1', { name: 'JS' }, { Authorization: `Bearer ${accessToken}` });
    const data = await res.json() as any;
    expect(data.success).toBe(true);
  });
});

// ===================== Articles =====================
describe('Articles API', () => {
  let articleId: number;

  it('POST /api/articles - creates article', async () => {
    const res = await req('POST', '/api/articles', {
      title: 'Test Post',
      content_md: '## Hello\n\nThis is a test post with enough content.',
      category_ids: [1],
      tag_ids: [1],
    }, { Authorization: `Bearer ${accessToken}` });
    const data = await res.json() as any;
    expect(res.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.data.title).toBe('Test Post');
    expect(data.data.status).toBe('draft');
    articleId = data.data.id;
  });

  it('POST /api/articles - missing title fails', async () => {
    const res = await req('POST', '/api/articles', { content_md: 'no title' }, { Authorization: `Bearer ${accessToken}` });
    expect(res.status).toBe(400);
  });

  it('GET /api/articles/:id - returns article', async () => {
    const res = await req('GET', `/api/articles/${articleId}`);
    const data = await res.json() as any;
    expect(data.success).toBe(true);
    expect(data.data.title).toBe('Test Post');
    expect(data.data.categories.length).toBe(1);
    expect(data.data.tags.length).toBe(1);
  });

  it('PUT /api/articles/:id - updates article', async () => {
    const res = await req('PUT', `/api/articles/${articleId}`, { title: 'Updated Title' }, { Authorization: `Bearer ${accessToken}` });
    const data = await res.json() as any;
    expect(data.success).toBe(true);
    expect(data.data.title).toBe('Updated Title');
  });

  it('POST /api/articles/:id/publish - publishes', async () => {
    const res = await req('POST', `/api/articles/${articleId}/publish`, {}, { Authorization: `Bearer ${accessToken}` });
    const data = await res.json() as any;
    expect(data.success).toBe(true);
    expect(data.data.status).toBe('published');
    expect(data.data.published_at).toBeTruthy();
  });

  it('GET /api/articles - public returns published', async () => {
    const res = await req('GET', '/api/articles');
    const data = await res.json() as any;
    expect(data.success).toBe(true);
    expect(data.data.length).toBe(1);
  });

  it('POST /api/articles/:id/unpublish - unpublishes', async () => {
    const res = await req('POST', `/api/articles/${articleId}/unpublish`, {}, { Authorization: `Bearer ${accessToken}` });
    const data = await res.json() as any;
    expect(data.success).toBe(true);
    expect(data.data.status).toBe('draft');
  });

  it('re-publish for further tests', async () => {
    await req('POST', `/api/articles/${articleId}/publish`, {}, { Authorization: `Bearer ${accessToken}` });
  });

  it('GET /api/articles/:id/versions - returns versions', async () => {
    const res = await req('GET', `/api/articles/${articleId}/versions`, undefined, { Authorization: `Bearer ${accessToken}` });
    const data = await res.json() as any;
    expect(data.success).toBe(true);
    expect(data.data.length).toBeGreaterThanOrEqual(1);
  });
});

// ===================== Comments =====================
describe('Comments API', () => {
  it('POST /api/articles/1/comments - creates comment', async () => {
    const res = await req('POST', '/api/articles/1/comments', {
      nickname: 'Tester',
      email: 'test@test.com',
      content: 'Great post!',
    });
    const data = await res.json() as any;
    expect(res.status).toBe(201);
    expect(data.data.nickname).toBe('Tester');
    expect(data.data.status).toBe('pending');
  });

  it('POST /api/articles/1/comments - missing fields fails', async () => {
    const res = await req('POST', '/api/articles/1/comments', { nickname: 'Tester' });
    expect(res.status).toBe(400);
  });

  it('POST /api/articles/1/comments - too long comment fails', async () => {
    const res = await req('POST', '/api/articles/1/comments', {
      nickname: 'Tester',
      email: 'test@test.com',
      content: 'x'.repeat(2001),
    });
    expect(res.status).toBe(400);
  });

  it('GET /api/articles/1/comments - returns approved only (empty)', async () => {
    const res = await req('GET', '/api/articles/1/comments');
    const data = await res.json() as any;
    expect(data.success).toBe(true);
    expect(data.data.length).toBe(0); // still pending
  });

  it('POST /api/comments/1/approve - approves comment', async () => {
    const res = await req('POST', '/api/comments/1/approve', {}, { Authorization: `Bearer ${accessToken}` });
    const data = await res.json() as any;
    expect(data.success).toBe(true);
    expect(data.data.status).toBe('approved');
  });

  it('GET /api/articles/1/comments - now returns approved', async () => {
    const res = await req('GET', '/api/articles/1/comments');
    const data = await res.json() as any;
    expect(data.data.length).toBe(1);
  });

  it('GET /api/comments - admin list', async () => {
    const res = await req('GET', '/api/comments', undefined, { Authorization: `Bearer ${accessToken}` });
    const data = await res.json() as any;
    expect(data.success).toBe(true);
    expect(data.data.length).toBeGreaterThanOrEqual(1);
  });
});

// ===================== Settings =====================
describe('Settings API', () => {
  it('GET /api/settings - returns defaults', async () => {
    const res = await req('GET', '/api/settings');
    const data = await res.json() as any;
    expect(data.success).toBe(true);
    expect(data.data.site_title).toBeDefined();
  });

  it('PUT /api/settings - updates settings', async () => {
    const res = await req('PUT', '/api/settings', { site_title: 'My Test Blog', about_content: '# About Me' }, { Authorization: `Bearer ${accessToken}` });
    const data = await res.json() as any;
    expect(data.success).toBe(true);
    expect(data.data.site_title).toBe('My Test Blog');
    expect(data.data.about_content).toBe('# About Me');
  });

  it('PUT /api/settings - requires auth', async () => {
    const res = await req('PUT', '/api/settings', { site_title: 'Hack' });
    expect(res.status).toBe(401);
  });
});

// ===================== Public Pages =====================
describe('Public Pages', () => {
  it('GET / - returns HTML', async () => {
    const res = await req('GET', '/');
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain('<!DOCTYPE html>');
  });

  it('GET /archive - returns HTML', async () => {
    const res = await req('GET', '/archive');
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain('Archive');
  });

  it('GET /about - returns HTML with about content', async () => {
    const res = await req('GET', '/about');
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain('About');
  });

  it('GET /search - returns HTML', async () => {
    const res = await req('GET', '/search');
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain('Search');
  });

  it('GET /category/tech - returns HTML', async () => {
    const res = await req('GET', '/category/tech');
    expect(res.status).toBe(200);
  });

  it('GET /category/nonexistent - returns 404', async () => {
    const res = await req('GET', '/category/nonexistent');
    expect(res.status).toBe(404);
  });

  it('GET /feed.xml - returns RSS', async () => {
    const res = await req('GET', '/feed.xml');
    expect(res.status).toBe(200);
    const xml = await res.text();
    expect(xml).toContain('<?xml');
    expect(xml).toContain('<rss');
  });

  it('GET /sitemap.xml - returns sitemap', async () => {
    const res = await req('GET', '/sitemap.xml');
    expect(res.status).toBe(200);
    const xml = await res.text();
    expect(xml).toContain('urlset');
    expect(xml).toContain('/about');
  });

  it('GET /robots.txt - returns robots', async () => {
    const res = await req('GET', '/robots.txt');
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain('User-agent');
    expect(text).toContain('Disallow: /admin');
  });

  it('GET /nonexistent - returns 404', async () => {
    const res = await req('GET', '/nonexistent-page');
    expect(res.status).toBe(404);
  });
});
