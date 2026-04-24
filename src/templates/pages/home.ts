// Home page template
import type { SiteSettings, ArticleWithMeta, Pagination, CategoryRow, TagRow, ArticleRow } from '../../env';
import type { Locale } from '../../utils/i18n';
import { t } from '../../utils/i18n';
import { renderLayout } from '../layout';
import { renderHeader } from '../components/header';
import { renderFooter } from '../components/footer';
import { renderArticleCard, renderArticleGrid } from '../components/article-card';
import { renderPagination } from '../components/pagination';
import { renderSidebar, type SidebarData } from '../components/sidebar';
import { renderBlogJsonLd } from '../components/seo';
import { escapeHtml } from '../../utils/html';
import { formatDate } from '../../utils/date';

export interface HomePageData {
  settings: SiteSettings;
  articles: ArticleWithMeta[];
  pagination: Pagination;
  sidebar: SidebarData;
  baseUrl: string;
  locale: Locale;
}

export function renderHomePage(data: HomePageData): string {
  const { settings, articles, pagination, sidebar, baseUrl, locale } = data;
  const heroArticle = articles.length > 0 ? articles[0] : null;
  const restArticles = articles.length > 1 ? articles.slice(1) : [];
  const startIndex = pagination.page === 1 ? 1 : 0;

  const heroSection = heroArticle && pagination.page === 1 ? renderHero(heroArticle, settings, locale) : '';

  const gridArticles = pagination.page === 1 ? restArticles : articles;

  const body = `
${renderHeader(settings, '/', locale)}
${heroSection}
<div class="content-layout">
  <main class="content-main">
    ${pagination.page > 1 ? `<div class="page-header"><h1 class="page-header-title">${t('home.all_posts', locale)}</h1><p class="page-header-desc">${t('home.page_of', locale, { page: String(pagination.page), total: String(pagination.totalPages) })}</p></div>` : ''}
    ${renderArticleGrid(gridArticles, startIndex, locale)}
    ${renderPagination(pagination, '/')}
  </main>
  ${renderSidebar(sidebar, locale)}
</div>
${renderFooter(settings, locale)}`;

  return renderLayout({
    title: settings.site_title,
    description: settings.site_description,
    canonical: baseUrl,
    settings,
    locale,
    extraHead: renderBlogJsonLd(settings, baseUrl),
  }, body);
}

function renderHero(article: ArticleWithMeta, settings: SiteSettings, locale: Locale): string {
  const categoryBadge = article.categories.length > 0
    ? `<span class="card-badge">${escapeHtml(article.categories[0].name)}</span>`
    : '';

  return `<section class="hero-section section-diagonal">
  <div class="hero-geo-circle" aria-hidden="true"></div>
  <div class="hero-inner">
    <span class="hero-number" aria-hidden="true">01</span>
    ${categoryBadge}
    <h1 class="hero-title"><a href="/article/${escapeHtml(article.slug)}">${escapeHtml(article.title)}</a></h1>
    <p class="hero-excerpt">${escapeHtml(article.excerpt || '')}</p>
    <div class="hero-meta">
      <span>${formatDate(article.published_at)}</span>
      <span class="sep">&middot;</span>
      <span>${article.reading_time} ${t('article.min_read', locale)}</span>
      ${article.comment_count > 0 ? `<span class="sep">&middot;</span><span>${article.comment_count} ${t('article.comments_count', locale)}</span>` : ''}
    </div>
    <a href="/article/${escapeHtml(article.slug)}" class="hero-readmore">${t('article.read_more', locale)} <span class="arrow">&rarr;</span></a>
  </div>
</section>`;
}
