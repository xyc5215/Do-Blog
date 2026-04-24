// Unit tests for template rendering
import { describe, it, expect } from 'vitest';
import { renderArticleCard, renderArticleGrid } from '../src/templates/components/article-card';
import { renderPagination } from '../src/templates/components/pagination';
import { renderCommentList, renderCommentForm } from '../src/templates/components/comments';
import { renderSidebar } from '../src/templates/components/sidebar';
import { renderHeader } from '../src/templates/components/header';
import { renderFooter } from '../src/templates/components/footer';
import { renderErrorPage } from '../src/templates/pages/error';
import { renderAboutPage } from '../src/templates/pages/about';
import type { ArticleWithMeta, CommentRow, SiteSettings } from '../src/env';

const mockSettings: SiteSettings = {
  site_title: 'Test Blog',
  site_subtitle: 'A test blog',
  site_description: 'Test description',
  site_logo: '',
  nav_menu: [
    { label: 'Home', url: '/' },
    { label: 'About', url: '/about' },
  ],
  footer_content: 'Test Footer',
  posts_per_page: 10,
  comment_moderation: true,
  theme_colors: { primary: '#E8590C', accent: '#3730A3' },
  social_links: [],
  about_content: '# About\n\nTest about page',
};

const mockArticle: ArticleWithMeta = {
  id: 1,
  title: 'Test Article',
  slug: 'test-article',
  content_md: '# Hello',
  content_html: '<h1>Hello</h1>',
  excerpt: 'A test article',
  cover_image: '',
  status: 'published',
  published_at: '2024-06-15T12:00:00Z',
  read_count: 42,
  like_count: 5,
  comment_count: 3,
  reading_time: 2,
  created_at: '2024-06-15T12:00:00Z',
  updated_at: '2024-06-15T12:00:00Z',
  categories: [{ id: 1, name: 'Tech', slug: 'tech', description: '', parent_id: null, sort_order: 0, created_at: '' }],
  tags: [{ id: 1, name: 'JS', slug: 'js', created_at: '' }],
};

// ===================== article-card =====================
describe('article-card', () => {
  it('renders article card with title and link', () => {
    const html = renderArticleCard(mockArticle);
    expect(html).toContain('Test Article');
    expect(html).toContain('/article/test-article');
    expect(html).toContain('class="card');
  });

  it('includes category badge', () => {
    const html = renderArticleCard(mockArticle);
    expect(html).toContain('Tech');
    expect(html).toContain('card-badge');
  });

  it('shows card number when index provided', () => {
    const html = renderArticleCard(mockArticle, { index: 0 });
    expect(html).toContain('01');
  });

  it('shows reading time and comment count (zh)', () => {
    const html = renderArticleCard(mockArticle, {}, 'zh');
    expect(html).toContain('2 分钟阅读');
    expect(html).toContain('3 条评论');
  });

  it('shows reading time and comment count (en)', () => {
    const html = renderArticleCard(mockArticle, {}, 'en');
    expect(html).toContain('2 min read');
    expect(html).toContain('3 comments');
  });

  it('renderArticleGrid shows empty state (zh)', () => {
    const html = renderArticleGrid([], 0, 'zh');
    expect(html).toContain('暂无文章');
    expect(html).toContain('empty-state');
  });

  it('renderArticleGrid shows empty state (en)', () => {
    const html = renderArticleGrid([], 0, 'en');
    expect(html).toContain('No articles');
    expect(html).toContain('empty-state');
  });

  it('renderArticleGrid renders multiple cards', () => {
    const html = renderArticleGrid([mockArticle, mockArticle]);
    expect(html).toContain('article-grid');
    expect((html.match(/class="card[ "]/g) || []).length).toBe(2);
  });

  it('escapes XSS in title', () => {
    const xssArticle = { ...mockArticle, title: '<script>alert(1)</script>' };
    const html = renderArticleCard(xssArticle);
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
  });
});

// ===================== pagination =====================
describe('pagination', () => {
  it('returns empty for single page', () => {
    expect(renderPagination({ page: 1, pageSize: 10, total: 5, totalPages: 1 }, '/')).toBe('');
  });

  it('renders page buttons', () => {
    const html = renderPagination({ page: 2, pageSize: 10, total: 50, totalPages: 5 }, '/');
    expect(html).toContain('aria-label="Page navigation"');
    expect(html).toContain('aria-current="page"');
    expect(html).toContain('>2<');
  });

  it('disables prev on first page', () => {
    const html = renderPagination({ page: 1, pageSize: 10, total: 50, totalPages: 5 }, '/');
    expect(html).toContain('class="page-btn page-arrow disabled"');
  });

  it('includes page query param for non-first pages', () => {
    const html = renderPagination({ page: 1, pageSize: 10, total: 50, totalPages: 5 }, '/');
    expect(html).toContain('?page=2');
  });
});

// ===================== comments =====================
describe('comments', () => {
  const mockComment: CommentRow = {
    id: 1,
    article_id: 1,
    parent_id: null,
    nickname: 'Alice',
    email: 'alice@test.com',
    content: 'Great article!',
    status: 'approved',
    ip_address: '',
    created_at: new Date().toISOString(),
  };

  it('renders empty comments message (zh)', () => {
    const html = renderCommentList([], 'zh');
    expect(html).toContain('暂无评论');
  });

  it('renders empty comments message (en)', () => {
    const html = renderCommentList([], 'en');
    expect(html).toContain('No comments yet');
  });

  it('renders comment with nickname and content (zh)', () => {
    const html = renderCommentList([mockComment], 'zh');
    expect(html).toContain('Alice');
    expect(html).toContain('Great article!');
    expect(html).toContain('评论 (1)');
  });

  it('renders comment with nickname and content (en)', () => {
    const html = renderCommentList([mockComment], 'en');
    expect(html).toContain('Alice');
    expect(html).toContain('Great article!');
    expect(html).toContain('Comments (1)');
  });

  it('renders nested comments with indent', () => {
    const child: CommentRow = { ...mockComment, id: 2, parent_id: 1, nickname: 'Bob', content: 'Reply' };
    const html = renderCommentList([mockComment, child]);
    expect(html).toContain('Alice');
    expect(html).toContain('Bob');
    expect(html).toContain('margin-left');
  });

  it('escapes XSS in comment content', () => {
    const xssComment = { ...mockComment, content: '<img onerror=alert(1)>' };
    const html = renderCommentList([xssComment]);
    expect(html).not.toContain('<img');
    expect(html).toContain('&lt;img');
  });

  it('renders comment form with article ID', () => {
    const html = renderCommentForm(42);
    expect(html).toContain('data-article-id="42"');
    expect(html).toContain('comment-form');
  });
});

// ===================== sidebar =====================
describe('sidebar', () => {
  it('renders categories', () => {
    const html = renderSidebar({
      categories: [{ id: 1, name: 'Tech', slug: 'tech', description: '', parent_id: null, sort_order: 0, created_at: '', article_count: 5 }],
      tags: [],
      hotArticles: [],
    });
    expect(html).toContain('Tech');
    expect(html).toContain('/category/tech');
  });

  it('renders tag cloud', () => {
    const html = renderSidebar({
      categories: [],
      tags: [{ id: 1, name: 'JS', slug: 'js', created_at: '', article_count: 3 }],
      hotArticles: [],
    });
    expect(html).toContain('JS');
    expect(html).toContain('/tag/js');
    expect(html).toContain('tag-cloud');
  });

  it('renders hot articles with ranks', () => {
    const html = renderSidebar({
      categories: [],
      tags: [],
      hotArticles: [
        { id: 1, title: 'Popular Post', slug: 'popular', read_count: 100 } as any,
      ],
    });
    expect(html).toContain('Popular Post');
    expect(html).toContain('/article/popular');
    expect(html).toContain('hot-rank');
  });

  it('renders empty when no data', () => {
    const html = renderSidebar({ categories: [], tags: [], hotArticles: [] });
    expect(html).toContain('content-sidebar');
  });
});

// ===================== header =====================
describe('header', () => {
  it('renders nav links from settings', () => {
    const html = renderHeader(mockSettings, '/');
    expect(html).toContain('Home');
    expect(html).toContain('About');
    expect(html).toContain('nav-bar');
  });

  it('marks current path as active', () => {
    const html = renderHeader(mockSettings, '/about');
    expect(html).toContain('nav-link active');
  });

  it('includes theme toggle and search buttons', () => {
    const html = renderHeader(mockSettings, '/');
    expect(html).toContain('id="theme-toggle"');
    expect(html).toContain('/search');
  });

  it('includes language switcher', () => {
    const html = renderHeader(mockSettings, '/', 'zh');
    expect(html).toContain('id="lang-switch"');
    expect(html).toContain('EN');
  });

  it('escapes XSS in site title', () => {
    const xssSettings = { ...mockSettings, site_title: '<img onerror=alert(1)>' };
    const html = renderHeader(xssSettings, '/');
    expect(html).not.toContain('<img onerror');
    expect(html).toContain('&lt;img');
  });
});

// ===================== footer =====================
describe('footer', () => {
  it('renders site title and footer content', () => {
    const html = renderFooter(mockSettings);
    expect(html).toContain('Test Blog');
    expect(html).toContain('Test Footer');
  });

  it('renders nav links', () => {
    const html = renderFooter(mockSettings);
    expect(html).toContain('Home');
    expect(html).toContain('About');
  });

  it('renders RSS link (zh)', () => {
    const html = renderFooter(mockSettings, 'zh');
    expect(html).toContain('RSS 订阅');
    expect(html).toContain('/feed.xml');
  });

  it('renders RSS link (en)', () => {
    const html = renderFooter(mockSettings, 'en');
    expect(html).toContain('RSS Feed');
    expect(html).toContain('/feed.xml');
  });
});

// ===================== error page =====================
describe('error page', () => {
  it('renders 404 (zh)', () => {
    const html = renderErrorPage({ settings: mockSettings, code: 404, message: '未找到', locale: 'zh' });
    expect(html).toContain('404');
    expect(html).toContain('未找到');
    expect(html).toContain('返回首页');
  });

  it('renders 404 (en)', () => {
    const html = renderErrorPage({ settings: mockSettings, code: 404, message: 'Not Found', locale: 'en' });
    expect(html).toContain('404');
    expect(html).toContain('Not Found');
    expect(html).toContain('Back to Home');
  });

  it('renders 500 with description', () => {
    const html = renderErrorPage({ settings: mockSettings, code: 500, message: 'Server Error', description: 'Something broke' });
    expect(html).toContain('500');
    expect(html).toContain('Something broke');
  });
});

// ===================== about page =====================
describe('about page', () => {
  it('renders about page with content', () => {
    const html = renderAboutPage({
      settings: mockSettings,
      contentHtml: '<h1>About</h1><p>Test about page</p>',
      baseUrl: 'https://example.com',
      locale: 'zh',
    });
    expect(html).toContain('About');
    expect(html).toContain('Test about page');
    expect(html).toContain('prose');
  });

  it('includes canonical URL', () => {
    const html = renderAboutPage({
      settings: mockSettings,
      contentHtml: '<p>Hi</p>',
      baseUrl: 'https://example.com',
      locale: 'en',
    });
    expect(html).toContain('https://example.com/about');
  });
});
