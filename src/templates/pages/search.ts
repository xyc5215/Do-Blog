// Search page template
import type { SiteSettings, ArticleWithMeta, Pagination } from '../../env';
import type { Locale } from '../../utils/i18n';
import { t } from '../../utils/i18n';
import { renderLayout } from '../layout';
import { renderHeader } from '../components/header';
import { renderFooter } from '../components/footer';
import { renderArticleGrid } from '../components/article-card';
import { renderPagination } from '../components/pagination';
import { escapeHtml } from '../../utils/html';

export interface SearchPageData {
  settings: SiteSettings;
  query: string;
  articles: ArticleWithMeta[];
  pagination: Pagination;
  baseUrl: string;
  locale: Locale;
}

export function renderSearchPage(data: SearchPageData): string {
  const { settings, query, articles, pagination, baseUrl, locale } = data;
  const hasQuery = query.trim().length > 0;

  const resultsText = pagination.total === 1
    ? t('search.result_singular', locale, { query: escapeHtml(query) })
    : t('search.results', locale, { count: String(pagination.total), query: escapeHtml(query) });

  const resultsSection = hasQuery
    ? `<p style="color:var(--color-text-secondary);margin-bottom:var(--space-6);font-size:var(--text-sm);">
        ${resultsText}
      </p>
      ${renderArticleGrid(articles, 0, locale)}
      ${renderPagination(pagination, `/search?q=${encodeURIComponent(query)}`)}`
    : '';

  const body = `
${renderHeader(settings, '/search', locale)}
<div class="container">
  <div class="page-header">
    <h1 class="page-header-title">${t('search.title', locale)}</h1>
  </div>
  <div class="search-bar-wrap">
    <form action="/search" method="get">
      <span class="search-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      </span>
      <input type="search" name="q" class="search-input" placeholder="${t('search.placeholder', locale)}" value="${escapeHtml(query)}" autofocus>
    </form>
  </div>
  ${resultsSection}
</div>
${renderFooter(settings, locale)}`;

  return renderLayout({
    title: hasQuery ? `${t('search.title', locale)}: ${query}` : t('search.title', locale),
    description: `${t('search.title', locale)} - ${settings.site_title}`,
    canonical: `${baseUrl}/search`,
    settings,
    locale,
  }, body);
}
