// Header / Navigation component
import type { SiteSettings } from '../../env';
import type { Locale } from '../../utils/i18n';
import { t } from '../../utils/i18n';
import { escapeHtml } from '../../utils/html';

export function renderHeader(settings: SiteSettings, currentPath: string, locale: Locale = 'zh'): string {
  const navLinks = (settings.nav_menu || []).map(item => {
    const isActive = currentPath === item.url ||
      (item.url !== '/' && currentPath.startsWith(item.url));
    return `<a href="${escapeHtml(item.url)}" class="nav-link${isActive ? ' active' : ''}">${escapeHtml(item.label)}</a>`;
  }).join('\n        ');

  const mobileLinks = (settings.nav_menu || []).map(item =>
    `<a href="${escapeHtml(item.url)}" class="mobile-menu-link">${escapeHtml(item.label)}</a>`
  ).join('\n      ');

  return `<nav class="nav-bar">
  <div class="nav-inner">
    <a href="/" class="nav-logo">${escapeHtml(settings.site_title)}</a>
    <div class="nav-links">
      ${navLinks}
    </div>
    <div class="nav-actions">
      <button class="nav-icon-btn lang-btn" id="lang-switch" aria-label="${t('lang.label', locale)}" title="${t('lang.label', locale)}">
        ${t('lang.switch', locale)}
      </button>
      <button class="nav-icon-btn" id="theme-toggle" aria-label="${t('nav.toggle_theme', locale)}" title="${t('nav.toggle_theme', locale)}">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
      </button>
      <a href="/search" class="nav-icon-btn" aria-label="${t('nav.search', locale)}" title="${t('nav.search', locale)}">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      </a>
      <button class="nav-icon-btn nav-hamburger" id="nav-hamburger" aria-label="${t('nav.menu', locale)}">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>
    </div>
  </div>
</nav>
<div class="mobile-overlay" id="mobile-overlay"></div>
<div class="mobile-menu" id="mobile-menu">
  <div style="display:flex;justify-content:flex-end;margin-bottom:var(--space-6);">
    <button class="nav-icon-btn" onclick="document.getElementById('mobile-menu').classList.remove('open');document.getElementById('mobile-overlay').classList.remove('open');" aria-label="Close">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
  </div>
  ${mobileLinks}
</div>`;
}
