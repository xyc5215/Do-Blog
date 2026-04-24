// Base HTML layout shell for SSR pages
import { themeCSS } from '../styles/theme';
import { mainCSS } from '../styles/main';
import type { SiteSettings } from '../env';
import type { Locale } from '../utils/i18n';
import { htmlLang } from '../utils/i18n';
import { escapeHtml } from '../utils/html';

export interface LayoutOptions {
  title: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  bodyClass?: string;
  extraHead?: string;
  settings: SiteSettings;
  locale?: Locale;
}

export function renderLayout(opts: LayoutOptions, bodyContent: string): string {
  const locale = opts.locale || 'zh';
  const pageTitle = opts.title === opts.settings.site_title
    ? opts.title
    : `${escapeHtml(opts.title)} - ${escapeHtml(opts.settings.site_title)}`;
  const desc = escapeHtml(opts.description || opts.settings.site_description);

  return `<!DOCTYPE html>
<html lang="${htmlLang(locale)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${pageTitle}</title>
<meta name="description" content="${desc}">
${opts.canonical ? `<link rel="canonical" href="${escapeHtml(opts.canonical)}">` : ''}
<meta property="og:title" content="${escapeHtml(opts.title)}">
<meta property="og:description" content="${desc}">
<meta property="og:type" content="${opts.ogType || 'website'}">
${opts.ogImage ? `<meta property="og:image" content="${escapeHtml(opts.ogImage)}">` : ''}
${opts.canonical ? `<meta property="og:url" content="${escapeHtml(opts.canonical)}">` : ''}
<meta name="twitter:card" content="summary_large_image">
<link rel="alternate" type="application/rss+xml" title="${escapeHtml(opts.settings.site_title)} RSS" href="/feed.xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Noto+Serif+SC:wght@400;700&display=swap" rel="stylesheet">
<style>${themeCSS}${mainCSS}</style>
${opts.extraHead || ''}
<script>
(function(){
  var t = localStorage.getItem('theme');
  if (t === 'dark' || (!t && matchMedia('(prefers-color-scheme:dark)').matches)) {
    document.documentElement.setAttribute('data-theme','dark');
  }
})();
</script>
</head>
<body${opts.bodyClass ? ` class="${opts.bodyClass}"` : ''}>
${bodyContent}
<button class="back-to-top" id="btt" aria-label="Back to top">&uarr;</button>
<script>
(function(){
  // Nav scroll effect
  var nav = document.querySelector('.nav-bar');
  if (nav) {
    var onScroll = function(){ nav.classList.toggle('scrolled', window.scrollY > 10); };
    window.addEventListener('scroll', onScroll, {passive:true});
    onScroll();
  }

  // Theme toggle
  var btn = document.getElementById('theme-toggle');
  if (btn) {
    btn.addEventListener('click', function(){
      var root = document.documentElement;
      var current = root.getAttribute('data-theme');
      var next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  }

  // Back to top
  var btt = document.getElementById('btt');
  if (btt) {
    window.addEventListener('scroll', function(){
      btt.classList.toggle('visible', window.scrollY > 400);
    }, {passive:true});
    btt.addEventListener('click', function(){ window.scrollTo({top:0,behavior:'smooth'}); });
  }

  // Mobile menu
  var hamburger = document.getElementById('nav-hamburger');
  var mobileMenu = document.getElementById('mobile-menu');
  var overlay = document.getElementById('mobile-overlay');
  if (hamburger && mobileMenu && overlay) {
    hamburger.addEventListener('click', function(){
      mobileMenu.classList.toggle('open');
      overlay.classList.toggle('open');
    });
    overlay.addEventListener('click', function(){
      mobileMenu.classList.remove('open');
      overlay.classList.remove('open');
    });
  }

  // Scroll reveal
  if ('IntersectionObserver' in window) {
    var revealObs = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
      });
    }, {threshold:0.1});
    document.querySelectorAll('.reveal').forEach(function(el){ revealObs.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('visible'); });
  }

  // Language switcher
  var langBtn = document.getElementById('lang-switch');
  if (langBtn) {
    langBtn.addEventListener('click', function(){
      var cur = document.documentElement.lang;
      var next = (cur === 'en') ? 'zh' : 'en';
      document.cookie = 'blog_lang=' + next + ';path=/;max-age=31536000;SameSite=Lax';
      var u = new URL(window.location.href);
      u.searchParams.set('lang', next);
      window.location.href = u.toString();
    });
  }
})();
</script>
</body>
</html>`;
}
