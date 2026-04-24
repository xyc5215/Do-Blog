// Article card component
import type { ArticleWithMeta } from '../../env';
import type { Locale } from '../../utils/i18n';
import { t } from '../../utils/i18n';
import { escapeHtml } from '../../utils/html';
import { formatDate } from '../../utils/date';

export interface CardOptions {
  index?: number;
  featured?: boolean;
}

export function renderArticleCard(article: ArticleWithMeta, opts: CardOptions = {}, locale: Locale = 'zh'): string {
  const num = opts.index !== undefined ? String(opts.index + 1).padStart(2, '0') : '';
  const featuredClass = opts.featured ? ' featured' : '';
  const categoryBadge = article.categories.length > 0
    ? `<span class="card-badge">${escapeHtml(article.categories[0].name)}</span>`
    : '';
  const coverImg = article.cover_image
    ? `<img src="${escapeHtml(article.cover_image)}" alt="${escapeHtml(article.title)}" class="card-cover" loading="lazy">`
    : '';

  return `<article class="card${featuredClass} reveal">
  ${num ? `<span class="card-number" aria-hidden="true">${num}</span>` : ''}
  ${coverImg}
  ${categoryBadge}
  <h3 class="card-title"><a href="/article/${escapeHtml(article.slug)}">${escapeHtml(article.title)}</a></h3>
  <p class="card-excerpt">${escapeHtml(article.excerpt || '')}</p>
  <div class="card-meta">
    <span>${formatDate(article.published_at)}</span>
    <span class="sep">&middot;</span>
    <span>${article.reading_time} ${t('article.min_read', locale)}</span>
    ${article.comment_count > 0 ? `<span class="sep">&middot;</span><span>${article.comment_count} ${t('article.comments_count', locale)}</span>` : ''}
  </div>
</article>`;
}

export function renderArticleGrid(articles: ArticleWithMeta[], startIndex = 0, locale: Locale = 'zh'): string {
  if (articles.length === 0) {
    return `<div class="empty-state"><p>${t('article.no_articles', locale)}</p></div>`;
  }
  const cards = articles.map((a, i) =>
    renderArticleCard(a, { index: startIndex + i, featured: i === 0 && startIndex === 0 }, locale)
  ).join('\n');
  return `<div class="article-grid">${cards}</div>`;
}
