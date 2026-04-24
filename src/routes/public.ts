// Public SSR routes: /, /article/:slug, /archive, /category/:slug, /tag/:slug, /search, /feed.xml, /sitemap.xml, /robots.txt
import { Hono } from 'hono';
import type { Env } from '../env';
import { detectLocale } from '../utils/i18n';
import { t } from '../utils/i18n';
import * as articleService from '../services/article.service';
import * as categoryService from '../services/category.service';
import * as tagService from '../services/tag.service';
import * as commentService from '../services/comment.service';
import * as settingsService from '../services/settings.service';
import { renderMarkdown } from '../utils/markdown';
import { escapeHtml } from '../utils/html';
import { renderHomePage } from '../templates/pages/home';
import { renderArticlePage } from '../templates/pages/article';
import { renderArchivePage } from '../templates/pages/archive';
import { renderCategoryPage } from '../templates/pages/category';
import { renderTagPage } from '../templates/pages/tag';
import { renderSearchPage } from '../templates/pages/search';
import { renderAboutPage } from '../templates/pages/about';
import { renderErrorPage } from '../templates/pages/error';

export const publicRoutes = new Hono<{ Bindings: Env }>();

function getBaseUrl(c: any): string {
  const url = new URL(c.req.url);
  return `${url.protocol}//${url.host}`;
}

async function getSidebarData(env: Env) {
  const [categories, tags, hotArticles] = await Promise.all([
    categoryService.getCategories(env).then(async (cats) => {
      const withCounts = await Promise.all(cats.map(async (cat) => ({
        ...cat,
        article_count: await categoryService.getCategoryArticleCount(env, cat.id),
      })));
      return withCounts;
    }),
    tagService.getTagsWithCounts(env),
    articleService.getHotArticles(env, 5),
  ]);
  return { categories, tags, hotArticles };
}

// ==================== Home Page ====================
publicRoutes.get('/', async (c) => {
  const locale = detectLocale(c.req.raw);
  const settings = await settingsService.getSettings(c.env);
  const page = parseInt(c.req.query('page') || '1', 10);
  const pageSize = settings.posts_per_page || 10;

  const [articleData, sidebar] = await Promise.all([
    articleService.getPublishedArticles(c.env, page, pageSize),
    getSidebarData(c.env),
  ]);

  const html = renderHomePage({
    settings,
    articles: articleData.articles,
    pagination: articleData.pagination,
    sidebar,
    baseUrl: getBaseUrl(c),
    locale,
  });

  return c.html(html);
});

// ==================== Article Detail ====================
publicRoutes.get('/article/:slug', async (c) => {
  const slug = c.req.param('slug');
  const locale = detectLocale(c.req.raw);
  const settings = await settingsService.getSettings(c.env);
  const article = await articleService.getArticleBySlug(c.env, slug);

  if (!article || article.status !== 'published') {
    return c.html(renderErrorPage({
      settings,
      code: 404,
      message: t('error.article_not_found', locale),
      description: t('error.article_not_found_desc', locale),
      locale,
    }), 404);
  }

  // Extract TOC from HTML
  const toc = extractTocFromHtml(article.content_html);

  const [comments, adjacent] = await Promise.all([
    commentService.getApprovedComments(c.env, article.id),
    articleService.getAdjacentArticles(c.env, article.published_at || article.created_at),
  ]);

  // Increment read count (non-blocking)
  c.executionCtx.waitUntil(articleService.incrementReadCount(c.env, article.id));

  const html = renderArticlePage({
    settings,
    article,
    comments,
    prev: adjacent.prev,
    next: adjacent.next,
    toc,
    baseUrl: getBaseUrl(c),
    locale,
  });

  return c.html(html);
});

// ==================== Archive ====================
publicRoutes.get('/archive', async (c) => {
  const locale = detectLocale(c.req.raw);
  const settings = await settingsService.getSettings(c.env);
  const articles = await articleService.getArchiveArticles(c.env);

  const html = renderArchivePage({
    settings,
    articles,
    baseUrl: getBaseUrl(c),
    locale,
  });

  return c.html(html);
});

// ==================== Category ====================
publicRoutes.get('/category/:slug', async (c) => {
  const slug = c.req.param('slug');
  const locale = detectLocale(c.req.raw);
  const settings = await settingsService.getSettings(c.env);
  const category = await categoryService.getCategoryBySlug(c.env, slug);

  if (!category) {
    return c.html(renderErrorPage({
      settings,
      code: 404,
      message: t('error.category_not_found', locale),
      description: t('error.category_not_found_desc', locale),
      locale,
    }), 404);
  }

  const page = parseInt(c.req.query('page') || '1', 10);
  const pageSize = settings.posts_per_page || 10;
  const articleData = await articleService.getArticlesByCategory(c.env, category.id, page, pageSize);

  const html = renderCategoryPage({
    settings,
    category,
    articles: articleData.articles,
    pagination: articleData.pagination,
    baseUrl: getBaseUrl(c),
    locale,
  });

  return c.html(html);
});

// ==================== Tag ====================
publicRoutes.get('/tag/:slug', async (c) => {
  const slug = c.req.param('slug');
  const locale = detectLocale(c.req.raw);
  const settings = await settingsService.getSettings(c.env);
  const tag = await tagService.getTagBySlug(c.env, slug);

  if (!tag) {
    return c.html(renderErrorPage({
      settings,
      code: 404,
      message: t('error.tag_not_found', locale),
      description: t('error.tag_not_found_desc', locale),
      locale,
    }), 404);
  }

  const page = parseInt(c.req.query('page') || '1', 10);
  const pageSize = settings.posts_per_page || 10;
  const articleData = await articleService.getArticlesByTag(c.env, tag.id, page, pageSize);

  const html = renderTagPage({
    settings,
    tag,
    articles: articleData.articles,
    pagination: articleData.pagination,
    baseUrl: getBaseUrl(c),
    locale,
  });

  return c.html(html);
});

// ==================== About Page ====================
publicRoutes.get('/about', async (c) => {
  const locale = detectLocale(c.req.raw);
  const settings = await settingsService.getSettings(c.env);
  const aboutMd = settings.about_content || '';
  const { html: contentHtml } = renderMarkdown(aboutMd);

  const html = renderAboutPage({
    settings,
    contentHtml,
    baseUrl: getBaseUrl(c),
    locale,
  });

  return c.html(html);
});

// ==================== Search ====================
publicRoutes.get('/search', async (c) => {
  const query = (c.req.query('q') || '').trim();
  const locale = detectLocale(c.req.raw);
  const settings = await settingsService.getSettings(c.env);
  const page = parseInt(c.req.query('page') || '1', 10);
  const pageSize = settings.posts_per_page || 10;

  let articles: any[] = [];
  let pagination = { page: 1, pageSize, total: 0, totalPages: 0 };

  if (query.length > 0) {
    const result = await articleService.searchArticles(c.env, query, page, pageSize);
    articles = result.articles;
    pagination = result.pagination;
  }

  const html = renderSearchPage({
    settings,
    query,
    articles,
    pagination,
    baseUrl: getBaseUrl(c),
    locale,
  });

  return c.html(html);
});

// ==================== RSS Feed ====================
publicRoutes.get('/feed.xml', async (c) => {
  const settings = await settingsService.getSettings(c.env);
  const baseUrl = getBaseUrl(c);
  const articleData = await articleService.getPublishedArticles(c.env, 1, 20);

  const items = articleData.articles.map(a => `  <item>
    <title>${escapeXml(a.title)}</title>
    <link>${baseUrl}/article/${escapeXml(a.slug)}</link>
    <guid isPermaLink="true">${baseUrl}/article/${escapeXml(a.slug)}</guid>
    <description>${escapeXml(a.excerpt || '')}</description>
    <pubDate>${a.published_at ? new Date(a.published_at).toUTCString() : ''}</pubDate>
    ${a.categories.map(cat => `<category>${escapeXml(cat.name)}</category>`).join('\n    ')}
  </item>`).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(settings.site_title)}</title>
    <link>${baseUrl}</link>
    <description>${escapeXml(settings.site_description)}</description>
    <language>zh-CN</language>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
});

// ==================== Sitemap ====================
publicRoutes.get('/sitemap.xml', async (c) => {
  const baseUrl = getBaseUrl(c);
  const articles = await articleService.getArchiveArticles(c.env);
  const categories = await categoryService.getCategories(c.env);
  const tags = await tagService.getTags(c.env);

  const urls: string[] = [];
  urls.push(sitemapUrl(baseUrl, '/', 'daily', '1.0'));
  urls.push(sitemapUrl(baseUrl, '/archive', 'weekly', '0.6'));
  urls.push(sitemapUrl(baseUrl, '/about', 'monthly', '0.5'));
  urls.push(sitemapUrl(baseUrl, '/search', 'monthly', '0.3'));

  for (const a of articles) {
    urls.push(sitemapUrl(baseUrl, `/article/${a.slug}`, 'weekly', '0.8'));
  }
  for (const cat of categories) {
    urls.push(sitemapUrl(baseUrl, `/category/${cat.slug}`, 'weekly', '0.5'));
  }
  for (const tag of tags) {
    urls.push(sitemapUrl(baseUrl, `/tag/${tag.slug}`, 'weekly', '0.4'));
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
});

// ==================== Robots.txt ====================
publicRoutes.get('/robots.txt', (c) => {
  const baseUrl = getBaseUrl(c);
  const text = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml`;
  return new Response(text, { headers: { 'Content-Type': 'text/plain' } });
});

// ==================== Article read count (API for client-side tracking) ====================
publicRoutes.post('/api/articles/:id/read', async (c) => {
  const id = parseInt(c.req.param('id'), 10);
  if (isNaN(id)) return c.json({ success: false }, 400);
  await articleService.incrementReadCount(c.env, id);
  return c.json({ success: true });
});

// ==================== 404 Fallback ====================
publicRoutes.notFound(async (c) => {
  const locale = detectLocale(c.req.raw);
  const settings = await settingsService.getSettings(c.env);
  return c.html(renderErrorPage({
    settings,
    code: 404,
    message: t('error.not_found', locale),
    description: t('error.not_found_desc', locale),
    locale,
  }), 404);
});

// ==================== Helpers ====================
function escapeXml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function sitemapUrl(base: string, path: string, freq: string, priority: string): string {
  return `  <url>
    <loc>${escapeXml(base + path)}</loc>
    <changefreq>${freq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

function extractTocFromHtml(html: string): { id: string; text: string; level: number }[] {
  const toc: { id: string; text: string; level: number }[] = [];
  const regex = /<h([2-3])\s+id="([^"]*)"[^>]*>(.*?)<\/h[2-3]>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const text = match[3].replace(/<[^>]+>/g, '');
    toc.push({ level: parseInt(match[1], 10), id: match[2], text });
  }
  return toc;
}
