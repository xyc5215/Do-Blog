// Footer component
import type { SiteSettings } from '../../env';
import type { Locale } from '../../utils/i18n';
import { t } from '../../utils/i18n';
import { escapeHtml } from '../../utils/html';

export function renderFooter(settings: SiteSettings, locale: Locale = 'zh'): string {
  const year = new Date().getFullYear();

  const socialLinks = (settings.social_links || []).map(link =>
    `<a href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(link.label)}</a>`
  ).join('\n          ');

  const navLinks = (settings.nav_menu || []).map(item =>
    `<a href="${escapeHtml(item.url)}">${escapeHtml(item.label)}</a>`
  ).join('\n          ');

  return `<div class="footer-diagonal"></div>
<footer class="footer-wrap">
  <div class="footer-inner container">
    <div class="footer-section">
      <h3>${escapeHtml(settings.site_title)}</h3>
      <p>${escapeHtml(settings.site_subtitle || settings.site_description)}</p>
    </div>
    <div class="footer-section">
      <h3>${t('footer.navigation', locale)}</h3>
      ${navLinks}
      <a href="/feed.xml">${t('footer.rss', locale)}</a>
    </div>
    <div class="footer-section">
      <h3>${t('footer.connect', locale)}</h3>
      ${socialLinks || `<p>${t('footer.no_social', locale)}</p>`}
    </div>
  </div>
  <div class="footer-copyright container">
    &copy; ${year} ${escapeHtml(settings.site_title)}. ${escapeHtml(settings.footer_content || '')}
  </div>
  <div class="footer-geo-dots" aria-hidden="true"></div>
</footer>`;
}
