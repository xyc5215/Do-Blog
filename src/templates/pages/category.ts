// Category page template
import type { SiteSettings, ArticleWithMeta, Pagination, CategoryRow } from '../../env';
import type { Locale } from '../../utils/i18n';
import { t } from '../../utils/i18n';
import { renderLayout } from '../layout';
import { renderHeader } from '../components/header';
import { renderFooter } from '../components/footer';
import { renderArticleGrid } from '../components/article-card';
import { renderPagination } from '../components/pagination';
import { escapeHtml } from '../../utils/html';

export interface CategoryPageData {
  settings: SiteSettings;
  category: CategoryRow;
  articles: ArticleWithMeta[];
  pagination: Pagination;
  baseUrl: string;
  locale: Locale;
}

export function renderCategoryPage(data: CategoryPageData): string {
  const { settings, category, articles, pagination, baseUrl, locale } = data;
  const canonicalUrl = `${baseUrl}/category/${category.slug}`;

  const body = `
${renderHeader(settings, `/category/${category.slug}`, locale)}
<div class="container">
  <div class="page-header">
    <h1 class="page-header-title">${escapeHtml(category.name)}</h1>
    ${category.description ? `<p class="page-header-desc">${escapeHtml(category.description)}</p>` : ''}
  </div>
  ${renderArticleGrid(articles, 0, locale)}
  ${renderPagination(pagination, `/category/${category.slug}`)}
</div>
${renderFooter(settings, locale)}`;

  return renderLayout({
    title: category.name,
    description: category.description || t('category.articles_in', locale, { name: category.name }),
    canonical: canonicalUrl,
    settings,
    locale,
  }, body);
}
