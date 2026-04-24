// Comment list + form components
import type { CommentRow } from '../../env';
import type { Locale } from '../../utils/i18n';
import { t } from '../../utils/i18n';
import { escapeHtml } from '../../utils/html';
import { formatRelativeTime } from '../../utils/date';

export function renderCommentList(comments: CommentRow[], locale: Locale = 'zh'): string {
  if (comments.length === 0) {
    return `<div class="comments-section">
  <h3 class="comments-title">${t('comment.title', locale)}</h3>
  <p style="color:var(--color-text-tertiary);font-size:var(--text-sm);">${t('comment.empty', locale)}</p>
</div>`;
  }

  // Build a tree for nested comments
  const topLevel: CommentRow[] = [];
  const childrenMap = new Map<number, CommentRow[]>();

  for (const c of comments) {
    if (c.parent_id) {
      if (!childrenMap.has(c.parent_id)) childrenMap.set(c.parent_id, []);
      childrenMap.get(c.parent_id)!.push(c);
    } else {
      topLevel.push(c);
    }
  }

  const renderSingle = (c: CommentRow, depth = 0): string => {
    const initial = (c.nickname || '?')[0].toUpperCase();
    const indent = depth > 0 ? ` style="margin-left:${Math.min(depth, 3) * 40}px"` : '';
    const children = childrenMap.get(c.id) || [];
    const childrenHtml = children.map(ch => renderSingle(ch, depth + 1)).join('\n');

    return `<div class="comment-item"${indent}>
  <div class="comment-avatar" aria-hidden="true">${escapeHtml(initial)}</div>
  <div class="comment-content">
    <div class="comment-header">
      <span class="comment-nick">${escapeHtml(c.nickname)}</span>
      <span class="comment-time">${formatRelativeTime(c.created_at)}</span>
    </div>
    <div class="comment-text">${escapeHtml(c.content)}</div>
  </div>
</div>
${childrenHtml}`;
  };

  const items = topLevel.map(c => renderSingle(c)).join('\n');

  return `<div class="comments-section">
  <h3 class="comments-title">${t('comment.title', locale)} (${comments.length})</h3>
  ${items}
</div>`;
}

export function renderCommentForm(articleId: number, locale: Locale = 'zh'): string {
  return `<div class="comments-section">
  <form class="comment-form" id="comment-form" data-article-id="${articleId}">
    <div class="form-row">
      <input type="text" class="form-input" name="nickname" placeholder="${t('comment.name', locale)} *" required maxlength="50">
      <input type="email" class="form-input" name="email" placeholder="${t('comment.email', locale)} *" required maxlength="100">
    </div>
    <textarea class="form-textarea" name="content" placeholder="${t('comment.placeholder', locale)}" required maxlength="2000" rows="4"></textarea>
    <input type="hidden" name="parent_id" value="">
    <button type="submit" class="btn-primary">${t('comment.submit', locale)}</button>
  </form>
  <div class="toast" id="comment-toast"></div>
</div>
<script>
(function(){
  var form = document.getElementById('comment-form');
  if (!form) return;
  var _t = ${JSON.stringify({ submitting: t('comment.submitting', locale), success: t('comment.success', locale), fail: t('comment.fail', locale), network: t('comment.network_error', locale), submit: t('comment.submit', locale) })};
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var fd = new FormData(form);
    var articleId = form.getAttribute('data-article-id');
    var body = {
      nickname: fd.get('nickname'),
      email: fd.get('email'),
      content: fd.get('content'),
    };
    var parentId = fd.get('parent_id');
    if (parentId) body.parent_id = parseInt(parentId);

    var btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = _t.submitting;

    fetch('/api/articles/' + articleId + '/comments', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(body)
    })
    .then(function(r){ return r.json(); })
    .then(function(data){
      var toast = document.getElementById('comment-toast');
      if (data.success) {
        toast.textContent = _t.success;
        toast.classList.add('show');
        form.reset();
      } else {
        toast.textContent = data.error ? data.error.message : _t.fail;
        toast.classList.add('show');
      }
      setTimeout(function(){ toast.classList.remove('show'); }, 3500);
    })
    .catch(function(){
      var toast = document.getElementById('comment-toast');
      toast.textContent = _t.network;
      toast.classList.add('show');
      setTimeout(function(){ toast.classList.remove('show'); }, 3500);
    })
    .finally(function(){
      btn.disabled = false;
      btn.textContent = _t.submit;
    });
  });
})();
</script>`;
}
