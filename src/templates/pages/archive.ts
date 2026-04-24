// Archive page template
import type { SiteSettings, ArticleRow } from '../../env';
import type { Locale } from '../../utils/i18n';
import { t } from '../../utils/i18n';
import { renderLayout } from '../layout';
import { renderHeader } from '../components/header';
import { renderFooter } from '../components/footer';
import { escapeHtml } from '../../utils/html';
import { getYear, getMonth } from '../../utils/date';

export interface ArchivePageData {
  settings: SiteSettings;
  articles: ArticleRow[];
  baseUrl: string;
  locale: Locale;
}

export function renderArchivePage(data: ArchivePageData): string {
  const { settings, articles, baseUrl, locale } = data;

  // Group articles by year -> month
  const grouped = new Map<number, Map<number, ArticleRow[]>>();
  for (const a of articles) {
    if (!a.published_at) continue;
    const year = getYear(a.published_at);
    const month = getMonth(a.published_at);
    if (!grouped.has(year)) grouped.set(year, new Map());
    const yearMap = grouped.get(year)!;
    if (!yearMap.has(month)) yearMap.set(month, []);
    yearMap.get(month)!.push(a);
  }

  let archiveHtml = '';
  const sortedYears = Array.from(grouped.keys()).sort((a, b) => b - a);

  for (const year of sortedYears) {
    archiveHtml += `<div class="archive-year">${year}</div>`;
    const yearMap = grouped.get(year)!;
    const sortedMonths = Array.from(yearMap.keys()).sort((a, b) => b - a);

    for (const month of sortedMonths) {
      const monthArticles = yearMap.get(month)!;
      archiveHtml += `<h3 class="archive-month">${t(`month.${month}`, locale)}</h3>`;
      archiveHtml += `<ul class="archive-list">`;
      for (const a of monthArticles) {
        const day = a.published_at ? new Date(a.published_at).getDate().toString().padStart(2, '0') : '';
        archiveHtml += `
  <li class="archive-item reveal">
    <span class="archive-date">${day}</span>
    <a href="/article/${escapeHtml(a.slug)}">${escapeHtml(a.title)}</a>
  </li>`;
      }
      archiveHtml += `</ul>`;
    }
  }

  if (articles.length === 0) {
    archiveHtml = `<div class="empty-state"><p>${t('archive.empty', locale)}</p></div>`;
  }

  const body = `
${renderHeader(settings, '/archive', locale)}
<div class="container">
  <div class="page-header">
    <h1 class="page-header-title">${t('archive.title', locale)}</h1>
    <p class="page-header-desc">${t('archive.count', locale, { count: String(articles.length) })}</p>
  </div>
  ${archiveHtml}
</div>
${renderFooter(settings, locale)}`;

  return renderLayout({
    title: t('archive.title', locale),
    description: t('archive.count', locale, { count: String(articles.length) }),
    canonical: `${baseUrl}/archive`,
    settings,
    locale,
  }, body);
}
