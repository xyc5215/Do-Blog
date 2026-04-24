// Main CSS: layout, components, typography, geometric elements
export const mainCSS = `
/* ============================================
   GLOBAL LAYOUT
   ============================================ */
body {
  font-family: var(--font-sans);
  font-size: var(--text-base);
  line-height: 1.6;
  color: var(--color-text);
  background: var(--color-bg);
}

a { color: var(--color-primary); text-decoration: none; transition: color var(--duration-fast) var(--ease-out); }
a:hover { color: var(--color-primary-hover); }

.container {
  width: 100%;
  max-width: var(--max-width-wide);
  margin: 0 auto;
  padding: 0 var(--space-6);
}

/* ============================================
   NAVIGATION BAR
   ============================================ */
.nav-bar {
  position: sticky;
  top: 0;
  z-index: 100;
  height: 64px;
  display: flex;
  align-items: center;
  background: rgba(var(--color-bg-rgb), 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid transparent;
  transition: border-color var(--duration-normal) ease;
}
.nav-bar.scrolled {
  border-bottom-color: var(--color-border);
}
.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: var(--max-width-wide);
  margin: 0 auto;
  padding: 0 var(--space-6);
}
.nav-logo {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: var(--text-xl);
  color: var(--color-text);
  text-decoration: none;
}
.nav-logo:hover { color: var(--color-primary); }
.nav-links {
  display: flex;
  align-items: center;
  gap: var(--space-6);
  list-style: none;
}
.nav-link {
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-secondary);
  text-decoration: none;
  position: relative;
  padding: var(--space-1) 0;
}
.nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--color-primary);
  transform: scaleX(0);
  transform-origin: center;
  transition: transform var(--duration-normal) var(--ease-out);
}
.nav-link:hover, .nav-link.active { color: var(--color-text); }
.nav-link:hover::after, .nav-link.active::after { transform: scaleX(1); }
.nav-actions {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}
.nav-icon-btn {
  width: 36px; height: 36px;
  border-radius: var(--radius-full);
  border: none;
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-lg);
  transition: all var(--duration-fast) var(--ease-out);
}
.nav-icon-btn:hover { background: var(--color-bg-secondary); color: var(--color-text); }
.lang-btn {
  font-size: var(--text-xs);
  font-weight: 700;
  letter-spacing: .04em;
  width: auto;
  padding: 0 10px;
  border: 1.5px solid var(--color-border);
  background: var(--color-bg-secondary);
}

/* Mobile menu */
.nav-hamburger { display: none; }
.mobile-menu {
  display: none;
  position: fixed;
  top: 0; right: 0; bottom: 0;
  width: 280px;
  background: var(--color-surface);
  z-index: 200;
  padding: var(--space-10) var(--space-6);
  transform: translateX(100%);
  transition: transform var(--duration-slow) var(--ease-out);
  box-shadow: var(--shadow-lg);
}
.mobile-menu.open { transform: translateX(0); display: block; }
.mobile-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 199;
}
.mobile-overlay.open { display: block; }
.mobile-menu-link {
  display: block;
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--color-text);
  text-decoration: none;
  padding: var(--space-3) 0;
  border-bottom: 1px solid var(--color-border);
}
.mobile-menu-link:hover { color: var(--color-primary); }

@media (max-width: 767px) {
  .nav-links { display: none; }
  .nav-hamburger { display: flex; }
  .nav-bar { height: 56px; }
}

/* ============================================
   HERO SECTION
   ============================================ */
.hero-section {
  position: relative;
  background: var(--color-bg-secondary);
  padding: var(--space-20) 0 var(--space-24) 0;
  overflow: hidden;
}
.hero-inner {
  max-width: var(--max-width-content);
  margin: 0 auto;
  padding: 0 var(--space-6);
  position: relative;
  z-index: 1;
}
.hero-number {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 6rem;
  line-height: 0.9;
  color: var(--color-geo-1);
  opacity: 0.3;
  position: absolute;
  top: -10px;
  left: var(--space-6);
  pointer-events: none;
  user-select: none;
}
:root[data-theme="dark"] .hero-number { opacity: 0.08; }
.hero-title {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: var(--text-4xl);
  line-height: 1.15;
  color: var(--color-text);
  margin-bottom: var(--space-4);
  max-width: 800px;
}
.hero-title a { color: inherit; text-decoration: none; }
.hero-title a:hover { color: var(--color-primary); }
.hero-excerpt {
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  line-height: 1.7;
  max-width: 600px;
  margin-bottom: var(--space-5);
}
.hero-meta {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
  margin-bottom: var(--space-5);
  flex-wrap: wrap;
}
.hero-meta .sep { opacity: 0.5; }
.hero-readmore {
  font-family: var(--font-sans);
  font-weight: 600;
  font-size: var(--text-sm);
  color: var(--color-primary);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
}
.hero-readmore .arrow {
  transition: transform var(--duration-normal) var(--ease-out);
  display: inline-block;
}
.hero-readmore:hover .arrow { transform: translateX(4px); }

/* Geo circle decoration */
.hero-geo-circle {
  position: absolute;
  width: 350px; height: 350px;
  border-radius: 50%;
  background: var(--color-geo-2);
  opacity: 0.25;
  top: -100px; right: -80px;
  pointer-events: none;
}
:root[data-theme="dark"] .hero-geo-circle { opacity: 0.06; }

/* Diagonal cut */
.section-diagonal { position: relative; }
.section-diagonal::after {
  content: '';
  position: absolute;
  bottom: -1px; left: 0;
  width: 100%; height: 80px;
  background: var(--color-bg);
  clip-path: polygon(0 60%, 100% 0, 100% 100%, 0 100%);
  z-index: 2;
}

@media (min-width: 1024px) {
  .hero-title { font-size: var(--text-5xl); }
  .hero-number { font-size: 7rem; }
}

/* ============================================
   CONTENT LAYOUT (Main + Sidebar)
   ============================================ */
.content-layout {
  display: flex;
  gap: var(--space-12);
  max-width: var(--max-width-wide);
  margin: 0 auto;
  padding: var(--space-12) var(--space-6);
}
.content-main { flex: 1; min-width: 0; }
.content-sidebar {
  width: 280px;
  flex-shrink: 0;
  display: none;
}
@media (min-width: 1024px) {
  .content-sidebar { display: block; }
}

/* ============================================
   ARTICLE CARDS
   ============================================ */
.article-grid {
  display: grid;
  gap: var(--space-6);
  grid-template-columns: 1fr;
}
@media (min-width: 768px) {
  .article-grid { grid-template-columns: 1fr 1fr; }
}
@media (min-width: 1024px) {
  .article-grid { grid-template-columns: 3fr 2fr; }
  .article-grid .card:nth-child(5n+4),
  .article-grid .card:nth-child(5n+5) { order: 1; }
  .article-grid .card.featured { grid-row: span 2; }
}

.card {
  position: relative;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
  padding: var(--space-5);
  overflow: hidden;
  transition: all var(--duration-normal) var(--ease-out);
}
.card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
  border-left: 3px solid var(--color-primary);
}
.card:hover .card-title { color: var(--color-primary); }

.card-number {
  position: absolute;
  top: var(--space-3);
  left: var(--space-4);
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 3rem;
  line-height: 1;
  color: var(--color-geo-1);
  opacity: 0.15;
  pointer-events: none;
  user-select: none;
}
:root[data-theme="dark"] .card-number { opacity: 0.06; }
@media (max-width: 767px) { .card-number { display: none; } }

.card-cover {
  width: 100%;
  aspect-ratio: 16/9;
  object-fit: cover;
  border-radius: var(--radius-md);
  margin-bottom: var(--space-4);
}

.card-badge {
  display: inline-block;
  font-size: var(--text-xs);
  font-weight: 500;
  font-family: var(--font-sans);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 2px 10px;
  border-radius: var(--radius-sm);
  background: var(--color-primary-soft);
  color: var(--color-primary);
  margin-bottom: var(--space-2);
}

.card-title {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: var(--text-xl);
  line-height: 1.3;
  color: var(--color-text);
  margin-bottom: var(--space-2);
  transition: color var(--duration-fast) var(--ease-out);
}
.card-title a { color: inherit; text-decoration: none; }
.card.featured .card-title { font-size: var(--text-2xl); }

.card-excerpt {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: var(--space-3);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.card.featured .card-excerpt { -webkit-line-clamp: 3; font-size: var(--text-base); }

.card-meta {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
}
.card-meta .sep { opacity: 0.5; }

/* ============================================
   SIDEBAR
   ============================================ */
.sidebar-block {
  margin-bottom: var(--space-10);
}
.sidebar-title {
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-tertiary);
  margin-bottom: var(--space-4);
  padding-bottom: var(--space-2);
  position: relative;
}
.sidebar-title::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0;
  width: 24px; height: 2px;
  background: var(--color-primary);
}

.sidebar-categories a {
  display: block;
  padding: var(--space-1) 0;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  text-decoration: none;
}
.sidebar-categories a:hover { color: var(--color-primary); }
.sidebar-categories .count {
  float: right;
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
}

/* Tag cloud */
.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}
.tag-cloud a {
  display: inline-block;
  padding: 2px 10px;
  font-size: var(--text-xs);
  border-radius: var(--radius-sm);
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: all var(--duration-fast) var(--ease-out);
}
.tag-cloud a:hover { background: var(--color-primary-soft); color: var(--color-primary); }

/* Hot articles */
.hot-list { list-style: none; }
.hot-item {
  display: flex;
  gap: var(--space-3);
  padding: var(--space-2) 0;
  border-bottom: 1px solid var(--color-border);
}
.hot-item:last-child { border-bottom: none; }
.hot-rank {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: var(--text-lg);
  color: var(--color-primary);
  width: 24px;
  flex-shrink: 0;
}
.hot-item a {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  text-decoration: none;
  line-height: 1.4;
}
.hot-item a:hover { color: var(--color-primary); }

/* ============================================
   PAGINATION
   ============================================ */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  margin-top: var(--space-10);
}
.page-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px; height: 40px;
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: all var(--duration-fast) var(--ease-out);
  border: none;
  background: transparent;
  cursor: pointer;
}
.page-btn:hover { background: var(--color-bg-secondary); color: var(--color-text); }
.page-btn.active {
  background: var(--color-primary);
  color: white;
  font-weight: 700;
}
.page-btn.disabled { opacity: 0.3; pointer-events: none; }
.page-arrow:hover { transform: translateX(-2px); }
.page-arrow.next:hover { transform: translateX(2px); }

/* ============================================
   FOOTER
   ============================================ */
.footer-diagonal {
  position: relative;
  height: 80px;
  background: var(--color-bg);
}
.footer-diagonal::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0;
  width: 100%; height: 80px;
  background: var(--color-bg-secondary);
  clip-path: polygon(0 60%, 100% 0, 100% 100%, 0 100%);
}
.footer-wrap {
  background: var(--color-bg-secondary);
  padding: var(--space-12) 0 var(--space-8) 0;
  position: relative;
}
.footer-inner {
  max-width: var(--max-width-wide);
  margin: 0 auto;
  padding: 0 var(--space-6);
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-8);
}
@media (min-width: 768px) {
  .footer-inner { grid-template-columns: 2fr 1fr 1fr; }
}
.footer-section h3 {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: var(--text-lg);
  margin-bottom: var(--space-3);
}
.footer-section p, .footer-section a {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}
.footer-section a { text-decoration: none; display: block; padding: var(--space-1) 0; }
.footer-section a:hover { color: var(--color-primary); }
.footer-copyright {
  text-align: center;
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  padding-top: var(--space-8);
  border-top: 1px solid var(--color-border);
  margin-top: var(--space-8);
}
/* Footer geo dots decoration */
.footer-geo-dots {
  position: absolute;
  bottom: var(--space-8);
  right: var(--space-8);
  width: 80px; height: 80px;
  background-image: radial-gradient(circle, var(--color-border-strong) 1.5px, transparent 1.5px);
  background-size: 16px 16px;
  opacity: 0.4;
  pointer-events: none;
}

/* ============================================
   BACK TO TOP
   ============================================ */
.back-to-top {
  position: fixed;
  bottom: var(--space-6);
  right: var(--space-6);
  width: 44px; height: 44px;
  border-radius: 50%;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-md);
  color: var(--color-text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-lg);
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--duration-normal) ease, transform var(--duration-fast) var(--ease-out);
  z-index: 50;
}
.back-to-top.visible { opacity: 1; pointer-events: auto; }
.back-to-top:hover { transform: translateY(-2px); color: var(--color-primary); }

/* ============================================
   PAGE HEADERS (Archive, Category, Tag, Search)
   ============================================ */
.page-header {
  padding: var(--space-16) 0 var(--space-10);
  position: relative;
}
.page-header-title {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: var(--text-4xl);
  line-height: 1.15;
  margin-bottom: var(--space-2);
}
.page-header-desc {
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
}

/* ============================================
   ARTICLE DETAIL PAGE
   ============================================ */
.article-header {
  background: var(--color-bg-secondary);
  padding: var(--space-16) 0 var(--space-12);
  position: relative;
  overflow: hidden;
}
.article-header-inner {
  max-width: var(--max-width-content);
  margin: 0 auto;
  padding: 0 var(--space-6);
  position: relative;
  z-index: 1;
}
.article-header .geo-triangle {
  position: absolute;
  width: 200px; height: 200px;
  background: var(--color-geo-1);
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  opacity: 0.15;
  top: -40px; left: -60px;
  transform: rotate(15deg);
  pointer-events: none;
}
:root[data-theme="dark"] .article-header .geo-triangle { opacity: 0.04; }
.article-detail-title {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: var(--text-4xl);
  line-height: 1.15;
  margin: var(--space-3) 0 var(--space-5);
  max-width: 800px;
}
@media (min-width: 1024px) { .article-detail-title { font-size: var(--text-5xl); } }
.article-author-row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-6);
}
.author-avatar {
  width: 32px; height: 32px;
  border-radius: 50%;
  background: var(--color-geo-1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-xs);
  font-weight: 700;
  color: var(--color-primary);
}
.article-cover {
  width: 100%;
  max-width: var(--max-width-content);
  border-radius: var(--radius-xl);
  margin-top: var(--space-6);
  position: relative;
  z-index: 3;
  margin-bottom: -40px;
}

/* Article body + TOC layout */
.article-body-layout {
  display: flex;
  gap: var(--space-12);
  max-width: var(--max-width-content);
  margin: var(--space-12) auto 0;
  padding: 0 var(--space-6);
  align-items: flex-start;
}
.article-body { flex: 1; min-width: 0; max-width: var(--max-width-prose); }
.article-toc {
  width: 220px;
  flex-shrink: 0;
  position: sticky;
  top: 80px;
  display: none;
}
@media (min-width: 1024px) { .article-toc { display: block; } }
.toc-list {
  list-style: none;
  border-left: 2px solid var(--color-border);
  padding-left: var(--space-4);
}
.toc-item {
  padding: var(--space-1) 0;
}
.toc-item a {
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
  text-decoration: none;
  transition: color var(--duration-fast) ease;
}
.toc-item a:hover, .toc-item.active a { color: var(--color-primary); }
.toc-item.active { border-left: 2px solid var(--color-primary); margin-left: calc(-1 * var(--space-4) - 2px); padding-left: var(--space-4); }
.toc-item.level-3 { padding-left: var(--space-4); }

/* Article footer: tags, likes, prev/next */
.article-footer {
  max-width: var(--max-width-prose);
  margin: var(--space-12) auto 0;
  padding: 0 var(--space-6) var(--space-8);
  border-bottom: 1px solid var(--color-border);
}
.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-6);
}
.article-tags a {
  display: inline-block;
  padding: 4px 12px;
  font-size: var(--text-xs);
  border-radius: var(--radius-full);
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  text-decoration: none;
}
.article-tags a:hover { background: var(--color-primary-soft); color: var(--color-primary); }

.article-actions {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  margin-bottom: var(--space-8);
}
.like-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-5);
  border-radius: var(--radius-full);
  border: 1.5px solid var(--color-border);
  background: transparent;
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: all var(--duration-normal) var(--ease-out);
}
.like-btn:hover { border-color: var(--color-primary); color: var(--color-primary); }
.like-btn.liked { border-color: #EF4444; color: #EF4444; }
.like-btn .heart { display: inline-block; transition: transform var(--duration-slow) cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.like-btn.liked .heart { transform: scale(1.2); }

.prev-next {
  display: flex;
  justify-content: space-between;
  gap: var(--space-4);
}
.prev-next a {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  text-decoration: none;
  max-width: 45%;
}
.prev-next a:hover { color: var(--color-primary); }
.prev-next .label {
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-tertiary);
  margin-bottom: var(--space-1);
}

/* ============================================
   COMMENTS SECTION
   ============================================ */
.comments-section {
  max-width: var(--max-width-prose);
  margin: var(--space-10) auto;
  padding: 0 var(--space-6);
}
.comments-title {
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-tertiary);
  margin-bottom: var(--space-6);
  position: relative;
  padding-bottom: var(--space-2);
}
.comments-title::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0;
  width: 24px; height: 2px;
  background: var(--color-primary);
}
.comment-item {
  display: flex;
  gap: var(--space-3);
  padding: var(--space-5) 0;
  border-bottom: 1px solid var(--color-border);
}
.comment-avatar {
  width: 40px; height: 40px;
  border-radius: 50%;
  background: var(--color-geo-1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: var(--text-sm);
  color: var(--color-primary);
  flex-shrink: 0;
}
:root[data-theme="dark"] .comment-avatar { background: var(--color-geo-2); color: var(--color-accent); }
.comment-content { flex: 1; min-width: 0; }
.comment-header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-1);
}
.comment-nick { font-weight: 600; font-size: var(--text-sm); color: var(--color-text); }
.comment-time { font-size: var(--text-xs); color: var(--color-text-tertiary); }
.comment-text { font-size: var(--text-base); line-height: 1.6; color: var(--color-text-secondary); }

/* Comment form */
.comment-form {
  margin-top: var(--space-8);
}
.form-row {
  display: flex;
  gap: var(--space-4);
  margin-bottom: var(--space-4);
}
@media (max-width: 767px) { .form-row { flex-direction: column; } }
.form-input, .form-textarea {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: var(--text-sm);
  transition: border-color var(--duration-fast) ease, box-shadow var(--duration-fast) ease;
}
.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: var(--shadow-glow);
}
.form-textarea {
  min-height: 120px;
  resize: vertical;
  margin-bottom: var(--space-4);
}
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-md);
  border: none;
  background: var(--color-primary);
  color: white;
  font-weight: 600;
  font-size: var(--text-sm);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}
.btn-primary:hover { filter: brightness(1.1); }
.btn-primary:active { transform: scale(0.97); }

/* Toast notification */
.toast {
  position: fixed;
  top: 0; left: 50%;
  transform: translateX(-50%) translateY(-100%);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-6);
  box-shadow: var(--shadow-lg);
  font-size: var(--text-sm);
  z-index: 300;
  transition: transform var(--duration-slow) var(--ease-out);
}
.toast.show { transform: translateX(-50%) translateY(var(--space-4)); }

/* ============================================
   ARCHIVE PAGE
   ============================================ */
.archive-year {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: var(--text-6xl);
  color: var(--color-geo-1);
  border-bottom: 2px solid var(--color-border);
  padding-bottom: var(--space-2);
  margin: var(--space-10) 0 var(--space-6);
}
:root[data-theme="dark"] .archive-year { color: var(--color-geo-2); }
.archive-month {
  font-size: var(--text-xl);
  font-weight: 600;
  margin: var(--space-6) 0 var(--space-3);
  color: var(--color-text);
}
.archive-list { list-style: none; border-left: 1px solid var(--color-border); padding-left: var(--space-6); }
.archive-item {
  display: flex;
  align-items: baseline;
  gap: var(--space-4);
  padding: var(--space-2) 0;
  position: relative;
}
.archive-item::before {
  content: '';
  position: absolute;
  left: calc(-1 * var(--space-6) - 3px);
  top: 50%;
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--color-border-strong);
  transform: translateY(-50%);
}
.archive-date {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
  width: 50px;
  flex-shrink: 0;
}
.archive-item a {
  color: var(--color-text);
  text-decoration: none;
  font-size: var(--text-base);
}
.archive-item a:hover { color: var(--color-primary); }

/* ============================================
   SEARCH PAGE
   ============================================ */
.search-bar-wrap {
  max-width: 600px;
  margin: 0 auto var(--space-10);
  position: relative;
}
.search-input {
  width: 100%;
  height: 56px;
  padding: 0 var(--space-12) 0 var(--space-12);
  font-size: var(--text-lg);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-xl);
  background: var(--color-surface);
  color: var(--color-text);
  transition: border-color var(--duration-fast) ease, box-shadow var(--duration-fast) ease;
}
.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: var(--shadow-glow);
}
.search-icon {
  position: absolute;
  left: var(--space-4);
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-tertiary);
  font-size: var(--text-lg);
  pointer-events: none;
}
mark {
  background: var(--color-primary-soft);
  color: var(--color-primary);
  padding: 1px 3px;
  border-radius: 2px;
}

/* ============================================
   ERROR PAGES
   ============================================ */
.error-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  padding: var(--space-10);
}
.error-code {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 6rem;
  line-height: 1;
  color: var(--color-geo-1);
  position: relative;
  margin-bottom: var(--space-4);
}
.error-message {
  font-size: var(--text-2xl);
  font-weight: 600;
  margin-bottom: var(--space-2);
}
.error-desc {
  color: var(--color-text-secondary);
  margin-bottom: var(--space-6);
}
.error-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  background: var(--color-primary);
  color: white;
  border-radius: var(--radius-md);
  text-decoration: none;
  font-weight: 600;
  font-size: var(--text-sm);
}
.error-link:hover { filter: brightness(1.1); color: white; }

/* ============================================
   UTILITY
   ============================================ */
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
.empty-state {
  text-align: center;
  padding: var(--space-16) var(--space-6);
  color: var(--color-text-tertiary);
}
.empty-state p { font-size: var(--text-lg); }

/* Scroll reveal animation */
.reveal {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity var(--duration-slow) ease, transform var(--duration-slow) var(--ease-out);
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}

/* ============================================
   PROSE (Article Body Typography)
   ============================================ */
.prose {
  font-family: var(--font-body);
  font-size: var(--text-lg);
  line-height: 1.8;
  color: var(--color-text);
}
.prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
  font-family: var(--font-display);
  font-weight: 700;
  line-height: 1.3;
  margin-top: 2em;
  margin-bottom: 0.75em;
  color: var(--color-text);
}
.prose h2 {
  font-size: var(--text-2xl);
  padding-bottom: var(--space-2);
  border-bottom: 1px solid var(--color-border);
}
.prose h3 { font-size: var(--text-xl); }
.prose h4 { font-size: var(--text-lg); }
.prose p { margin-bottom: 1.5em; }
.prose a {
  color: var(--color-primary);
  text-decoration: underline;
  text-decoration-color: rgba(232,89,12,0.3);
  text-underline-offset: 3px;
  transition: text-decoration-color var(--duration-fast) ease;
}
.prose a:hover { text-decoration-color: var(--color-primary); }
.prose strong { font-weight: 700; color: var(--color-text); }
.prose em { font-style: italic; }
.prose ul, .prose ol { margin-bottom: 1.5em; padding-left: 1.5em; }
.prose li { margin-bottom: 0.5em; }
.prose li::marker { color: var(--color-primary); }
.prose blockquote {
  margin: 1.5em 0;
  padding: var(--space-4) var(--space-6);
  border-left: 3px solid var(--color-primary);
  background: var(--color-bg-secondary);
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
  color: var(--color-text-secondary);
  font-style: italic;
}
.prose blockquote p:last-child { margin-bottom: 0; }
.prose code {
  font-family: var(--font-mono);
  font-size: 0.875em;
  padding: 2px 6px;
  background: var(--color-code-bg);
  border: 1px solid var(--color-code-border);
  border-radius: var(--radius-sm);
  color: var(--color-code-text);
}
.prose pre {
  margin: 1.5em 0;
  padding: var(--space-5);
  background: var(--color-code-bg);
  border: 1px solid var(--color-code-border);
  border-radius: var(--radius-lg);
  overflow-x: auto;
  line-height: 1.6;
}
.prose pre code {
  padding: 0;
  background: none;
  border: none;
  border-radius: 0;
  font-size: var(--text-sm);
}
.prose img {
  max-width: 100%;
  height: auto;
  border-radius: var(--radius-lg);
  margin: 1.5em 0;
  box-shadow: var(--shadow-md);
}
.prose hr {
  border: none;
  height: 1px;
  background: var(--color-border);
  margin: 2.5em 0;
}
.prose table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5em 0;
  font-size: var(--text-sm);
  font-family: var(--font-sans);
}
.prose th, .prose td {
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-border);
  text-align: left;
}
.prose th {
  background: var(--color-bg-secondary);
  font-weight: 600;
}
.prose tr:nth-child(even) td { background: var(--color-bg-secondary); }
.prose > *:first-child { margin-top: 0; }
.prose > *:last-child { margin-bottom: 0; }
`;
