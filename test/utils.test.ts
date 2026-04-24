// Unit tests for utility functions
import { describe, it, expect } from 'vitest';
import { generateSlug, ensureUniqueSlug } from '../src/utils/slug';
import { escapeHtml } from '../src/utils/html';
import { calcPagination, getOffset } from '../src/utils/pagination';
import { formatDate, formatDateChinese, formatRelativeTime, getYear, getMonth, getMonthName } from '../src/utils/date';
import { renderMarkdown } from '../src/utils/markdown';

// ===================== slug.ts =====================
describe('slug', () => {
  it('generates basic slug from English title', () => {
    expect(generateSlug('Hello World')).toBe('hello-world');
  });

  it('generates slug from CJK title', () => {
    const slug = generateSlug('你好世界');
    expect(slug).toBe('你好世界');
  });

  it('handles mixed English and CJK', () => {
    const slug = generateSlug('Hello 你好 World');
    expect(slug).toBe('hello-你好-world');
  });

  it('strips special characters', () => {
    expect(generateSlug('Hello! @World#')).toBe('hello-world');
  });

  it('collapses multiple hyphens', () => {
    expect(generateSlug('Hello   ---  World')).toBe('hello-world');
  });

  it('removes leading/trailing hyphens', () => {
    expect(generateSlug(' - Hello World - ')).toBe('hello-world');
  });

  it('generates fallback slug for empty input', () => {
    const slug = generateSlug('!!!');
    expect(slug).toMatch(/^post-/);
  });

  it('generates fallback slug for whitespace only', () => {
    const slug = generateSlug('   ');
    expect(slug).toMatch(/^post-/);
  });

  it('handles underscores as separators', () => {
    expect(generateSlug('hello_world_test')).toBe('hello-world-test');
  });

  it('ensureUniqueSlug returns original if not taken', () => {
    expect(ensureUniqueSlug('hello', ['world', 'foo'])).toBe('hello');
  });

  it('ensureUniqueSlug appends number if taken', () => {
    expect(ensureUniqueSlug('hello', ['hello', 'hello-2'])).toBe('hello-3');
  });

  it('ensureUniqueSlug finds first available number', () => {
    expect(ensureUniqueSlug('test', ['test'])).toBe('test-2');
  });
});

// ===================== html.ts =====================
describe('escapeHtml', () => {
  it('escapes & < > " \'', () => {
    expect(escapeHtml('a & b < c > d " e \' f')).toBe('a &amp; b &lt; c &gt; d &quot; e &#x27; f');
  });

  it('handles empty string', () => {
    expect(escapeHtml('')).toBe('');
  });

  it('returns clean string unchanged', () => {
    expect(escapeHtml('Hello World')).toBe('Hello World');
  });

  it('escapes multiple same characters', () => {
    expect(escapeHtml('<<>>')).toBe('&lt;&lt;&gt;&gt;');
  });

  it('handles script tags', () => {
    expect(escapeHtml('<script>alert("xss")</script>')).toBe(
      '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
    );
  });
});

// ===================== pagination.ts =====================
describe('pagination', () => {
  it('calculates basic pagination', () => {
    const p = calcPagination(100, 1, 10);
    expect(p).toEqual({ page: 1, pageSize: 10, total: 100, totalPages: 10 });
  });

  it('handles partial last page', () => {
    const p = calcPagination(15, 1, 10);
    expect(p.totalPages).toBe(2);
  });

  it('clamps page to max', () => {
    const p = calcPagination(10, 999, 10);
    expect(p.page).toBe(1);
  });

  it('clamps page to min 1', () => {
    const p = calcPagination(10, 0, 10);
    expect(p.page).toBe(1);
  });

  it('handles zero total', () => {
    const p = calcPagination(0, 1, 10);
    expect(p).toEqual({ page: 1, pageSize: 10, total: 0, totalPages: 1 });
  });

  it('getOffset returns correct offset', () => {
    expect(getOffset(1, 10)).toBe(0);
    expect(getOffset(2, 10)).toBe(10);
    expect(getOffset(3, 5)).toBe(10);
  });
});

// ===================== date.ts =====================
describe('date utils', () => {
  it('formatDate returns YYYY-MM-DD', () => {
    expect(formatDate('2024-06-15T12:00:00Z')).toBe('2024-06-15');
  });

  it('formatDate handles null/undefined', () => {
    expect(formatDate(null as any)).toBe('');
    expect(formatDate(undefined as any)).toBe('');
    expect(formatDate('')).toBe('');
  });

  it('formatDateChinese returns Chinese format', () => {
    const result = formatDateChinese('2024-06-15T12:00:00Z');
    expect(result).toContain('2024');
    expect(result).toContain('6');
    expect(result).toContain('15');
  });

  it('getYear extracts year', () => {
    expect(getYear('2024-06-15T12:00:00Z')).toBe(2024);
  });

  it('getMonth extracts month (1-indexed)', () => {
    expect(getMonth('2024-06-15T12:00:00Z')).toBe(6);
  });

  it('getMonthName returns Chinese month', () => {
    expect(getMonthName(1)).toBe('一月');
    expect(getMonthName(12)).toBe('十二月');
  });

  it('formatRelativeTime returns relative string', () => {
    const now = new Date().toISOString();
    const result = formatRelativeTime(now);
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });
});

// ===================== markdown.ts =====================
describe('renderMarkdown', () => {
  it('renders basic markdown to HTML', () => {
    const result = renderMarkdown('# Hello\n\nWorld');
    expect(result.html).toContain('<h1');
    expect(result.html).toContain('Hello');
    expect(result.html).toContain('<p>World</p>');
  });

  it('generates excerpt', () => {
    const result = renderMarkdown('This is a test paragraph');
    expect(result.excerpt).toBe('This is a test paragraph');
  });

  it('truncates long excerpt', () => {
    const longText = 'a'.repeat(300);
    const result = renderMarkdown(longText);
    expect(result.excerpt.length).toBeLessThanOrEqual(203); // 200 + '...'
  });

  it('calculates reading time >= 1', () => {
    const result = renderMarkdown('Short text');
    expect(result.readingTime).toBeGreaterThanOrEqual(1);
  });

  it('calculates higher reading time for long text', () => {
    const longText = Array(500).fill('word').join(' ');
    const result = renderMarkdown(longText);
    expect(result.readingTime).toBeGreaterThan(1);
  });

  it('extracts TOC from h2 and h3', () => {
    const result = renderMarkdown('## Section 1\n\nText\n\n### Sub 1\n\nMore\n\n## Section 2');
    expect(result.toc.length).toBe(3);
    expect(result.toc[0].level).toBe(2);
    expect(result.toc[0].text).toBe('Section 1');
    expect(result.toc[1].level).toBe(3);
    expect(result.toc[2].level).toBe(2);
  });

  it('does not include h1 in TOC', () => {
    const result = renderMarkdown('# Title\n\n## Section');
    expect(result.toc.length).toBe(1);
    expect(result.toc[0].text).toBe('Section');
  });

  it('renders code blocks', () => {
    const result = renderMarkdown('```js\nconsole.log("hi")\n```');
    expect(result.html).toContain('<code');
    expect(result.html).toContain('console.log');
  });

  it('renders inline code', () => {
    const result = renderMarkdown('Use `const` here');
    expect(result.html).toContain('<code>const</code>');
  });

  it('adds lazy loading to images', () => {
    const result = renderMarkdown('![alt](https://example.com/img.png)');
    expect(result.html).toContain('loading="lazy"');
  });

  it('adds target _blank to external links', () => {
    const result = renderMarkdown('[link](https://example.com)');
    expect(result.html).toContain('target="_blank"');
    expect(result.html).toContain('rel="noopener noreferrer"');
  });

  it('does not add target _blank to internal links', () => {
    const result = renderMarkdown('[link](/about)');
    expect(result.html).not.toContain('target="_blank"');
  });

  it('strips markdown for plainText', () => {
    const result = renderMarkdown('**bold** and *italic* and [link](url)');
    expect(result.plainText).not.toContain('**');
    expect(result.plainText).not.toContain('*');
    expect(result.plainText).toContain('bold');
    expect(result.plainText).toContain('link');
  });

  it('handles empty input', () => {
    const result = renderMarkdown('');
    expect(result.html).toBe('');
    expect(result.excerpt).toBe('');
    expect(result.readingTime).toBe(1);
    expect(result.toc).toEqual([]);
  });

  it('prevents HTML injection', () => {
    const result = renderMarkdown('<script>alert("xss")</script>');
    expect(result.html).not.toContain('<script>');
  });

  it('handles Chinese content reading time', () => {
    const chinese = '这是一段中文测试'.repeat(100); // 800 Chinese chars
    const result = renderMarkdown(chinese);
    expect(result.readingTime).toBeGreaterThanOrEqual(3); // 800 / 300 ≈ 2.67 → 3
  });
});
