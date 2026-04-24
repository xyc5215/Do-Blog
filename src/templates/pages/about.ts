// About page template
import type { SiteSettings } from '../../env';
import type { Locale } from '../../utils/i18n';
import { t } from '../../utils/i18n';
import { renderLayout } from '../layout';
import { renderHeader } from '../components/header';
import { renderFooter } from '../components/footer';

export interface AboutPageData {
  settings: SiteSettings;
  contentHtml: string;
  baseUrl: string;
  locale: Locale;
}

export function renderAboutPage(data: AboutPageData): string {
  const { settings, contentHtml, baseUrl, locale } = data;

  const body = `
${renderHeader(settings, '/about', locale)}
<div class="container">
  <div class="page-header">
    <h1 class="page-header-title">${t('about.title', locale)}</h1>
  </div>
  <article class="article-body prose" style="max-width:720px">
    ${contentHtml}
  </article>
</div>
${renderFooter(settings, locale)}`;

  return renderLayout({
    title: t('about.title', locale),
    description: `${t('about.title', locale)} ${settings.site_title}`,
    canonical: `${baseUrl}/about`,
    settings,
    locale,
  }, body);
}
