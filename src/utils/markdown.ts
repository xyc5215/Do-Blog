// Markdown rendering with markdown-it + anchor plugin
import MarkdownIt from 'markdown-it';
import anchor from 'markdown-it-anchor';

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
});

md.use(anchor, {
  permalink: false,
  slugify: (s: string) =>
    s
      .trim()
      .toLowerCase()
      .replace(/[\s]+/g, '-')
      .replace(/[^\w\u4e00-\u9fff-]/g, ''),
});

// Add target="_blank" and rel="noopener" to external links
const defaultRender =
  md.renderer.rules.link_open ||
  function (tokens: any, idx: any, options: any, _env: any, self: any) {
    return self.renderToken(tokens, idx, options);
  };

md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
  const href = tokens[idx].attrGet('href');
  if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
    tokens[idx].attrSet('target', '_blank');
    tokens[idx].attrSet('rel', 'noopener noreferrer');
  }
  return defaultRender(tokens, idx, options, env, self);
};

// Add loading="lazy" to images
const defaultImageRender =
  md.renderer.rules.image ||
  function (tokens: any, idx: any, options: any, _env: any, self: any) {
    return self.renderToken(tokens, idx, options);
  };

md.renderer.rules.image = function (tokens, idx, options, env, self) {
  tokens[idx].attrSet('loading', 'lazy');
  return defaultImageRender(tokens, idx, options, env, self);
};

export interface MarkdownResult {
  html: string;
  toc: { id: string; text: string; level: number }[];
  excerpt: string;
  readingTime: number;
  plainText: string;
}

function extractToc(html: string): { id: string; text: string; level: number }[] {
  const toc: { id: string; text: string; level: number }[] = [];
  const regex = /<h([2-3])\s+id="([^"]*)"[^>]*>(.*?)<\/h[2-3]>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const text = match[3].replace(/<[^>]+>/g, '');
    toc.push({ level: parseInt(match[1], 10), id: match[2], text });
  }
  return toc;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function stripMarkdown(mdText: string): string {
  return mdText
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]+`/g, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[([^\]]+)\]\(.*?\)/g, '$1')
    .replace(/#{1,6}\s+/g, '')
    .replace(/[*_~]+/g, '')
    .replace(/>\s+/g, '')
    .replace(/[-*+]\s+/g, '')
    .replace(/\d+\.\s+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function calculateReadingTime(text: string): number {
  // Chinese: ~300 chars/min, English: ~200 words/min
  const chineseChars = (text.match(/[\u4e00-\u9fff]/g) || []).length;
  const englishWords = text
    .replace(/[\u4e00-\u9fff]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
  const minutes = chineseChars / 300 + englishWords / 200;
  return Math.max(1, Math.ceil(minutes));
}

function generateExcerpt(plainText: string, maxLen = 200): string {
  if (plainText.length <= maxLen) return plainText;
  return plainText.substring(0, maxLen).replace(/\s+\S*$/, '') + '...';
}

export function renderMarkdown(source: string): MarkdownResult {
  const html = md.render(source);
  const toc = extractToc(html);
  const plainText = stripMarkdown(source);
  const excerpt = generateExcerpt(plainText);
  const readingTime = calculateReadingTime(plainText);
  return { html, toc, excerpt, readingTime, plainText };
}
