// Error page template (404, 500, etc.)
import type { SiteSettings } from '../../env';
import type { Locale } from '../../utils/i18n';
import { t } from '../../utils/i18n';
import { renderLayout } from '../layout';
import { renderHeader } from '../components/header';
import { renderFooter } from '../components/footer';

export interface ErrorPageData {
  settings: SiteSettings;
  code: number;
  message: string;
  description?: string;
  locale?: Locale;
}

export function renderErrorPage(data: ErrorPageData): string {
  const { settings, code, message, description } = data;
  const locale = data.locale || 'zh';

  const body = `
${renderHeader(settings, '', locale)}
<div class="error-page">
  <div class="error-code">${code}</div>
  <h1 class="error-message">${message}</h1>
  ${description ? `<p class="error-desc">${description}</p>` : ''}
  <a href="/" class="error-link">&larr; ${t('error.back_home', locale)}</a>
</div>
${renderFooter(settings, locale)}`;

  return renderLayout({
    title: `${code} - ${message}`,
    settings,
    locale,
  }, body);
}
