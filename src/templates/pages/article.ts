// Article detail page template
import type { SiteSettings, ArticleWithMeta, ArticleRow, CommentRow } from '../../env';
import type { Locale } from '../../utils/i18n';
import { t } from '../../utils/i18n';
import { renderLayout } from '../layout';
import { renderHeader } from '../components/header';
import { renderFooter } from '../components/footer';
import { renderCommentList, renderCommentForm } from '../components/comments';
import { renderArticleJsonLd } from '../components/seo';
import { escapeHtml } from '../../utils/html';
import { formatDateChinese, formatDate } from '../../utils/date';

export interface ArticlePageData {
  settings: SiteSettings;
  article: ArticleWithMeta;
  comments: CommentRow[];
  prev: ArticleRow | null;
  next: ArticleRow | null;
  toc: { id: string; text: string; level: number }[];
  baseUrl: string;
  locale: Locale;
}

export function renderArticlePage(data: ArticlePageData): string {
  const { settings, article, comments, prev, next, toc, baseUrl, locale } = data;
  const articleUrl = `${baseUrl}/article/${article.slug}`;

  const categoryBadges = article.categories.map(c =>
    `<a href="/category/${escapeHtml(c.slug)}" class="card-badge">${escapeHtml(c.name)}</a>`
  ).join(' ');

  const tagLinks = article.tags.map(tag =>
    `<a href="/tag/${escapeHtml(tag.slug)}">#${escapeHtml(tag.name)}</a>`
  ).join('\n    ');

  const tocHtml = toc.length > 0 ? renderToc(toc, locale) : '';

  const coverHtml = article.cover_image
    ? `<img src="${escapeHtml(article.cover_image)}" alt="${escapeHtml(article.title)}" class="article-cover" loading="eager">`
    : '';

  const dateStr = locale === 'zh' ? formatDateChinese(article.published_at) : formatDate(article.published_at);

  const prevNextHtml = (prev || next) ? `<div class="prev-next">
  ${prev ? `<a href="/article/${escapeHtml(prev.slug)}"><div class="label">&larr; ${t('article.prev', locale)}</div><div>${escapeHtml(prev.title)}</div></a>` : '<span></span>'}
  ${next ? `<a href="/article/${escapeHtml(next.slug)}" style="text-align:right"><div class="label">${t('article.next', locale)} &rarr;</div><div>${escapeHtml(next.title)}</div></a>` : '<span></span>'}
</div>` : '';

  const body = `
${renderHeader(settings, '/article', locale)}
<header class="article-header section-diagonal">
  <div class="geo-triangle" aria-hidden="true"></div>
  <div class="article-header-inner">
    ${categoryBadges}
    <h1 class="article-detail-title">${escapeHtml(article.title)}</h1>
    <div class="article-author-row">
      <div class="author-avatar">${escapeHtml((settings.site_title || 'B')[0])}</div>
      <span>${escapeHtml(settings.site_title)}</span>
      <span class="sep">&middot;</span>
      <span>${dateStr}</span>
      <span class="sep">&middot;</span>
      <span>${article.reading_time} ${t('article.min_read', locale)}</span>
      <span class="sep">&middot;</span>
      <span>${article.read_count} ${t('article.views', locale)}</span>
    </div>
    ${coverHtml}
  </div>
</header>

<div class="article-body-layout">
  <article class="article-body prose">
    ${article.content_html}
  </article>
  ${tocHtml}
</div>

<div class="article-footer">
  ${tagLinks ? `<div class="article-tags">${tagLinks}</div>` : ''}
  <div class="article-actions">
    <button class="like-btn" id="like-btn" data-article-id="${article.id}">
      <span class="heart">&hearts;</span>
      <span id="like-count">${article.like_count}</span>
    </button>
  </div>
  ${prevNextHtml}
</div>

${renderCommentList(comments, locale)}
${renderCommentForm(article.id, locale)}

${renderFooter(settings, locale)}

<script>
(function(){
  // Like button
  var likeBtn = document.getElementById('like-btn');
  if (!likeBtn) return;
  var articleId = likeBtn.getAttribute('data-article-id');
  var liked = localStorage.getItem('liked:' + articleId);
  if (liked) likeBtn.classList.add('liked');

  likeBtn.addEventListener('click', function(){
    if (likeBtn.classList.contains('liked')) return;
    fetch('/api/articles/' + articleId + '/like', {method:'POST'})
      .then(function(r){ return r.json(); })
      .then(function(data){
        if (data.success) {
          likeBtn.classList.add('liked');
          localStorage.setItem('liked:' + articleId, '1');
          var countEl = document.getElementById('like-count');
          if (countEl) countEl.textContent = String(parseInt(countEl.textContent) + 1);
        }
      });
  });

  // Increment read count
  fetch('/api/articles/' + articleId + '/read', {method:'POST'}).catch(function(){});

  // TOC active tracking
  var tocItems = document.querySelectorAll('.toc-item');
  if (tocItems.length === 0) return;
  var headings = [];
  tocItems.forEach(function(item){
    var link = item.querySelector('a');
    if (!link) return;
    var href = link.getAttribute('href');
    if (!href) return;
    var target = document.getElementById(href.slice(1));
    if (target) headings.push({el: target, item: item});
  });

  if (headings.length > 0 && 'IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting) {
          tocItems.forEach(function(ti){ ti.classList.remove('active'); });
          for (var i = 0; i < headings.length; i++){
            if (headings[i].el === entry.target){ headings[i].item.classList.add('active'); break; }
          }
        }
      });
    }, {rootMargin: '-80px 0px -70% 0px'});
    headings.forEach(function(h){ obs.observe(h.el); });
  }
})();
</script>`;

  return renderLayout({
    title: article.title,
    description: article.excerpt,
    canonical: articleUrl,
    ogImage: article.cover_image || undefined,
    ogType: 'article',
    settings,
    locale,
    extraHead: renderArticleJsonLd(article, settings, articleUrl),
  }, body);
}

function renderToc(toc: { id: string; text: string; level: number }[], locale: Locale): string {
  const items = toc.map(item => {
    const levelClass = item.level >= 3 ? ' level-3' : '';
    return `<li class="toc-item${levelClass}"><a href="#${escapeHtml(item.id)}">${escapeHtml(item.text)}</a></li>`;
  }).join('\n    ');

  return `<nav class="article-toc" aria-label="Table of contents">
  <h4 class="sidebar-title">${t('article.toc', locale)}</h4>
  <ul class="toc-list">
    ${items}
  </ul>
</nav>`;
}
