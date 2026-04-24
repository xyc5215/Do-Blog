// Sidebar component: categories, tags, hot articles
import type { CategoryRow, TagRow, ArticleRow } from '../../env';
import type { Locale } from '../../utils/i18n';
import { t } from '../../utils/i18n';
import { escapeHtml } from '../../utils/html';

export interface SidebarData {
  categories: (CategoryRow & { article_count?: number })[];
  tags: (TagRow & { article_count?: number })[];
  hotArticles: ArticleRow[];
}

export function renderSidebar(data: SidebarData, locale: Locale = 'zh'): string {
  return `<aside class="content-sidebar">
  ${renderCategoriesBlock(data.categories, locale)}
  ${renderTagCloudBlock(data.tags, locale)}
  ${renderHotArticlesBlock(data.hotArticles, locale)}
</aside>`;
}

function renderCategoriesBlock(categories: (CategoryRow & { article_count?: number })[], locale: Locale): string {
  if (categories.length === 0) return '';
  const items = categories.map(c =>
    `<a href="/category/${escapeHtml(c.slug)}">${escapeHtml(c.name)}<span class="count">${c.article_count ?? ''}</span></a>`
  ).join('\n    ');

  return `<div class="sidebar-block">
  <h4 class="sidebar-title">${t('sidebar.categories', locale)}</h4>
  <div class="sidebar-categories">
    ${items}
  </div>
</div>`;
}

function renderTagCloudBlock(tags: (TagRow & { article_count?: number })[], locale: Locale): string {
  if (tags.length === 0) return '';
  const items = tags.map(tag =>
    `<a href="/tag/${escapeHtml(tag.slug)}">${escapeHtml(tag.name)}</a>`
  ).join('\n    ');

  return `<div class="sidebar-block">
  <h4 class="sidebar-title">${t('sidebar.tags', locale)}</h4>
  <div class="tag-cloud">
    ${items}
  </div>
</div>`;
}

function renderHotArticlesBlock(articles: ArticleRow[], locale: Locale): string {
  if (articles.length === 0) return '';
  const items = articles.map((a, i) =>
    `<li class="hot-item">
      <span class="hot-rank">${i + 1}</span>
      <a href="/article/${escapeHtml(a.slug)}">${escapeHtml(a.title)}</a>
    </li>`
  ).join('\n    ');

  return `<div class="sidebar-block">
  <h4 class="sidebar-title">${t('sidebar.popular', locale)}</h4>
  <ul class="hot-list">
    ${items}
  </ul>
</div>`;
}
