// Tag page template
import type { SiteSettings, ArticleWithMeta, Pagination, TagRow } from '../../env';
import type { Locale } from '../../utils/i18n';
import { t } from '../../utils/i18n';
import { renderLayout } from '../layout';
import { renderHeader } from '../components/header';
import { renderFooter } from '../components/footer';
import { renderArticleGrid } from '../components/article-card';
import { renderPagination } from '../components/pagination';
import { escapeHtml } from '../../utils/html';

export interface TagPageData {
  settings: SiteSettings;
  tag: TagRow;
  articles: ArticleWithMeta[];
  pagination: Pagination;
  baseUrl: string;
  locale: Locale;
}

export function renderTagPage(data: TagPageData): string {
  const { settings, tag, articles, pagination, baseUrl, locale } = data;
  const canonicalUrl = `${baseUrl}/tag/${tag.slug}`;

  const taggedText = pagination.total === 1
    ? t('tag.article_tagged', locale)
    : t('tag.articles_tagged', locale, { count: String(pagination.total) });

  const body = `
${renderHeader(settings, `/tag/${tag.slug}`, locale)}
<div class="container">
  <div class="page-header">
    <h1 class="page-header-title">#${escapeHtml(tag.name)}</h1>
    <p class="page-header-desc">${taggedText}</p>
  </div>
  ${renderArticleGrid(articles, 0, locale)}
  ${renderPagination(pagination, `/tag/${tag.slug}`)}
</div>
${renderFooter(settings, locale)}`;

  return renderLayout({
    title: `#${tag.name}`,
    description: taggedText,
    canonical: canonicalUrl,
    settings,
    locale,
  }, body);
}
