// Full Admin Panel SPA — embedded single-file application
import { themeCSS } from '../../styles/theme';

export function renderAdminShell(): string {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Admin Panel</title>
<meta name="robots" content="noindex, nofollow">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
${themeCSS}
${adminCSS}
</style>
<script>
(function(){
  var t=localStorage.getItem('theme');
  if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches))
    document.documentElement.setAttribute('data-theme','dark');
  var lang=localStorage.getItem('admin_lang')||'zh';
  document.documentElement.lang=lang==='zh'?'zh-CN':'en';
})();
</script>
</head>
<body>
<div id="app"></div>
<script>
${adminJS}
</script>
</body>
</html>`;
}

/* ================================================================
   ADMIN CSS
   ================================================================ */
const adminCSS = `
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:var(--font-sans);color:var(--color-text);background:var(--color-bg);line-height:1.5}
a{color:var(--color-primary);text-decoration:none}
a:hover{color:var(--color-primary-hover)}
button{font:inherit;cursor:pointer}

/* --- Login --- */
.login-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center}
.login-box{width:100%;max-width:380px;padding:var(--space-8)}
.login-box h1{font-family:var(--font-display);font-size:var(--text-2xl);text-align:center;margin-bottom:var(--space-8)}
.fg{margin-bottom:var(--space-4)}
.fg label{display:block;font-size:var(--text-sm);font-weight:500;margin-bottom:var(--space-1);color:var(--color-text-secondary)}
.fg input,.fg textarea,.fg select{width:100%;padding:var(--space-2) var(--space-3);border:1.5px solid var(--color-border);border-radius:var(--radius-md);background:var(--color-surface);color:var(--color-text);font-size:var(--text-sm);transition:border-color .15s,box-shadow .15s}
.fg input:focus,.fg textarea:focus,.fg select:focus{outline:none;border-color:var(--color-primary);box-shadow:var(--shadow-glow)}
.fg textarea{min-height:120px;resize:vertical;font-family:var(--font-mono);font-size:var(--text-sm);line-height:1.6}
.btn{display:inline-flex;align-items:center;gap:var(--space-2);padding:var(--space-2) var(--space-4);border:none;border-radius:var(--radius-md);font-weight:600;font-size:var(--text-sm);transition:all .15s}
.btn-primary{background:var(--color-primary);color:#fff}
.btn-primary:hover{filter:brightness(1.1)}
.btn-secondary{background:var(--color-bg-secondary);color:var(--color-text);border:1px solid var(--color-border)}
.btn-secondary:hover{background:var(--color-bg-tertiary)}
.btn-danger{background:var(--color-danger);color:#fff}
.btn-danger:hover{filter:brightness(1.1)}
.btn-sm{padding:var(--space-1) var(--space-3);font-size:var(--text-xs)}
.btn-ghost{background:transparent;color:var(--color-text-secondary);border:1px solid var(--color-border)}
.btn-ghost:hover{background:var(--color-bg-secondary);color:var(--color-text)}
.btn-success{background:var(--color-success);color:#fff}
.btn-success:hover{filter:brightness(1.1)}
.btn-w{width:100%;justify-content:center}
.err-msg{color:var(--color-danger);font-size:var(--text-sm);margin-top:var(--space-2)}

/* --- Shell --- */
.shell{display:flex;min-height:100vh}
.sidebar{width:220px;flex-shrink:0;background:var(--color-surface);border-right:1px solid var(--color-border);padding:var(--space-5) 0;display:flex;flex-direction:column;position:fixed;top:0;left:0;bottom:0;z-index:10}
.sidebar-brand{font-family:var(--font-display);font-weight:700;font-size:var(--text-lg);padding:0 var(--space-5) var(--space-6);display:flex;align-items:center;gap:var(--space-2)}
.sidebar-brand .dot{width:8px;height:8px;border-radius:50%;background:var(--color-primary)}
.sidebar nav{flex:1}
.sidebar .nav-item{display:flex;align-items:center;gap:var(--space-3);padding:var(--space-2) var(--space-5);font-size:var(--text-sm);color:var(--color-text-secondary);cursor:pointer;transition:all .15s;border-left:3px solid transparent;text-decoration:none}
.sidebar .nav-item:hover{background:var(--color-bg-secondary);color:var(--color-text)}
.sidebar .nav-item.active{color:var(--color-primary);background:var(--color-primary-soft);border-left-color:var(--color-primary);font-weight:600}
.sidebar .nav-item svg{width:18px;height:18px;flex-shrink:0}
.sidebar-footer{padding:var(--space-4) var(--space-5);border-top:1px solid var(--color-border);font-size:var(--text-xs)}
.sidebar-footer a{color:var(--color-text-tertiary);text-decoration:none;display:block;padding:var(--space-1) 0}
.sidebar-footer a:hover{color:var(--color-primary)}
.main{flex:1;margin-left:220px}
.topbar{display:flex;align-items:center;justify-content:space-between;height:56px;padding:0 var(--space-6);border-bottom:1px solid var(--color-border);background:var(--color-surface);position:sticky;top:0;z-index:5}
.topbar h2{font-family:var(--font-display);font-size:var(--text-lg);font-weight:700}
.topbar-actions{display:flex;align-items:center;gap:var(--space-3)}
.page{padding:var(--space-6);max-width:1200px}

/* --- Stats --- */
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:var(--space-4);margin-bottom:var(--space-8)}
.stat{background:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-lg);padding:var(--space-5);transition:box-shadow .2s}
.stat:hover{box-shadow:var(--shadow-md)}
.stat .sl{font-size:var(--text-xs);color:var(--color-text-tertiary);text-transform:uppercase;letter-spacing:.06em}
.stat .sv{font-family:var(--font-display);font-size:var(--text-3xl);font-weight:700;margin-top:var(--space-1)}

/* --- Table --- */
.tbl{width:100%;border-collapse:collapse;font-size:var(--text-sm)}
.tbl th,.tbl td{padding:var(--space-3) var(--space-4);text-align:left;border-bottom:1px solid var(--color-border)}
.tbl th{font-weight:600;color:var(--color-text-tertiary);font-size:var(--text-xs);text-transform:uppercase;letter-spacing:.04em;background:var(--color-bg-secondary)}
.tbl tr:hover td{background:var(--color-bg-secondary)}
.tbl .actions{display:flex;gap:var(--space-2);flex-wrap:wrap}
.badge{display:inline-block;padding:1px 8px;border-radius:var(--radius-full);font-size:var(--text-xs);font-weight:500}
.badge-green{background:#dcfce7;color:#166534}
.badge-yellow{background:#fef9c3;color:#854d0e}
.badge-red{background:#fee2e2;color:#991b1b}
.badge-blue{background:#dbeafe;color:#1e40af}
:root[data-theme="dark"] .badge-green{background:#052e16;color:#86efac}
:root[data-theme="dark"] .badge-yellow{background:#422006;color:#fde047}
:root[data-theme="dark"] .badge-red{background:#450a0a;color:#fca5a5}
:root[data-theme="dark"] .badge-blue{background:#172554;color:#93c5fd}

/* --- Toolbar --- */
.toolbar{display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-4);flex-wrap:wrap}
.toolbar select{padding:var(--space-2) var(--space-3);border:1px solid var(--color-border);border-radius:var(--radius-md);background:var(--color-surface);color:var(--color-text);font-size:var(--text-sm)}
.toolbar input[type="search"]{padding:var(--space-2) var(--space-3);border:1px solid var(--color-border);border-radius:var(--radius-md);background:var(--color-surface);color:var(--color-text);font-size:var(--text-sm);min-width:200px}
.pager{display:flex;align-items:center;gap:var(--space-2);margin-top:var(--space-4);font-size:var(--text-sm);color:var(--color-text-secondary)}
.pager button{padding:var(--space-1) var(--space-3)}

/* --- Editor --- */
.editor-wrap{display:flex;gap:0;height:calc(100vh - 56px - 80px);border:1px solid var(--color-border);border-radius:var(--radius-lg);overflow:hidden}
.editor-pane{flex:1;display:flex;flex-direction:column;min-width:0}
.editor-pane textarea{flex:1;border:none;padding:var(--space-4);font-family:var(--font-mono);font-size:var(--text-sm);line-height:1.7;resize:none;background:var(--color-surface);color:var(--color-text);outline:none;tab-size:2}
.editor-divider{width:1px;background:var(--color-border);flex-shrink:0}
.preview-pane{flex:1;overflow-y:auto;padding:var(--space-4);font-family:var(--font-body);font-size:var(--text-sm);line-height:1.7;background:var(--color-bg-secondary);min-width:0}
.preview-pane h1,.preview-pane h2,.preview-pane h3{font-family:var(--font-display);margin:1em 0 .5em}
.preview-pane h2{font-size:1.3em;border-bottom:1px solid var(--color-border);padding-bottom:.3em}
.preview-pane pre{background:var(--color-code-bg);padding:var(--space-3);border-radius:var(--radius-md);overflow-x:auto;font-family:var(--font-mono);font-size:var(--text-xs)}
.preview-pane code{font-family:var(--font-mono);font-size:.9em;background:var(--color-code-bg);padding:1px 4px;border-radius:3px}
.preview-pane pre code{background:none;padding:0}
.preview-pane blockquote{border-left:3px solid var(--color-primary);padding-left:var(--space-3);color:var(--color-text-secondary);margin:1em 0}
.preview-pane img{max-width:100%;border-radius:var(--radius-md)}
.preview-pane table{width:100%;border-collapse:collapse;margin:1em 0}
.preview-pane th,.preview-pane td{border:1px solid var(--color-border);padding:var(--space-2) var(--space-3);text-align:left;font-size:var(--text-xs)}
.preview-pane th{background:var(--color-bg-secondary);font-weight:600}
.editor-meta{display:grid;grid-template-columns:1fr 1fr;gap:var(--space-4);margin-bottom:var(--space-4)}
.editor-meta .fg{margin-bottom:0}
.editor-actions{display:flex;align-items:center;gap:var(--space-3);margin-top:var(--space-4)}
.editor-status{font-size:var(--text-xs);color:var(--color-text-tertiary);margin-left:auto;display:flex;align-items:center;gap:var(--space-3)}

/* --- MD Toolbar --- */
.md-toolbar{display:flex;align-items:center;gap:2px;padding:var(--space-2) var(--space-3);border-bottom:1px solid var(--color-border);background:var(--color-surface);flex-wrap:wrap}
.md-toolbar button{width:32px;height:32px;border:none;border-radius:var(--radius-md);background:transparent;color:var(--color-text-secondary);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:var(--text-sm);transition:all .12s}
.md-toolbar button:hover{background:var(--color-bg-secondary);color:var(--color-text)}
.md-toolbar button:active{background:var(--color-primary-soft);color:var(--color-primary)}
.md-toolbar button[title]:hover::after{content:attr(title);position:absolute;bottom:-28px;left:50%;transform:translateX(-50%);background:var(--color-text);color:var(--color-bg);padding:2px 8px;border-radius:4px;font-size:10px;white-space:nowrap;pointer-events:none;z-index:10}
.md-toolbar button{position:relative}
.md-toolbar .sep{width:1px;height:20px;background:var(--color-border);margin:0 4px}
.md-guide{font-size:var(--text-xs);color:var(--color-text-tertiary);padding:var(--space-2) var(--space-3);border-bottom:1px solid var(--color-border);background:var(--color-bg-secondary);display:none;line-height:1.8}
.md-guide.show{display:block}
.md-guide kbd{background:var(--color-surface);border:1px solid var(--color-border);border-radius:3px;padding:0 4px;font-family:var(--font-mono);font-size:10px}

/* --- Tag/Cat Picker --- */
.picker-wrap{display:flex;flex-wrap:wrap;gap:var(--space-2);margin-top:var(--space-2)}
.picker-chip{display:inline-flex;align-items:center;gap:4px;padding:2px 10px;border-radius:var(--radius-full);font-size:var(--text-xs);cursor:pointer;border:1.5px solid var(--color-border);background:var(--color-surface);color:var(--color-text-secondary);transition:all .15s;user-select:none}
.picker-chip:hover{border-color:var(--color-primary);color:var(--color-primary)}
.picker-chip.selected{background:var(--color-primary);color:#fff;border-color:var(--color-primary)}
.picker-chip.selected:hover{filter:brightness(1.1)}

/* --- Modal --- */
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:100;display:flex;align-items:center;justify-content:center}
.modal{background:var(--color-surface);border-radius:var(--radius-lg);padding:var(--space-6);max-width:500px;width:90%;box-shadow:var(--shadow-lg)}
.modal h3{font-family:var(--font-display);margin-bottom:var(--space-4)}
.modal-actions{display:flex;gap:var(--space-3);margin-top:var(--space-6);justify-content:flex-end}

/* --- Toast --- */
.toast-wrap{position:fixed;top:var(--space-4);right:var(--space-4);z-index:200;display:flex;flex-direction:column;gap:var(--space-2)}
.toast{padding:var(--space-3) var(--space-5);border-radius:var(--radius-md);font-size:var(--text-sm);background:var(--color-surface);border:1px solid var(--color-border);box-shadow:var(--shadow-lg);animation:toastIn .3s var(--ease-out)}
.toast-success{border-left:3px solid var(--color-success)}
.toast-error{border-left:3px solid var(--color-danger)}
@keyframes toastIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:none}}

/* --- Empty --- */
.empty{text-align:center;padding:var(--space-16) var(--space-6);color:var(--color-text-tertiary)}
.empty p{font-size:var(--text-lg)}

/* --- Comment --- */
.comment-card{border:1px solid var(--color-border);border-radius:var(--radius-md);padding:var(--space-4);margin-bottom:var(--space-3);background:var(--color-surface)}
.comment-card .cm-header{display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-2);font-size:var(--text-sm)}
.comment-card .cm-nick{font-weight:600}
.comment-card .cm-time{color:var(--color-text-tertiary);font-size:var(--text-xs)}
.comment-card .cm-article{color:var(--color-text-tertiary);font-size:var(--text-xs)}
.comment-card .cm-body{font-size:var(--text-sm);color:var(--color-text-secondary);margin-bottom:var(--space-3)}
.comment-card .cm-actions{display:flex;gap:var(--space-2)}

/* --- Settings --- */
.settings-grid{display:grid;gap:var(--space-6);max-width:700px}
.settings-section{background:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-lg);padding:var(--space-6)}
.settings-section h3{font-family:var(--font-display);font-size:var(--text-lg);margin-bottom:var(--space-4);padding-bottom:var(--space-2);border-bottom:1px solid var(--color-border)}
.list-editor{display:flex;flex-direction:column;gap:var(--space-2)}
.list-editor-item{display:flex;align-items:center;gap:var(--space-2)}
.list-editor-item input{flex:1}
.list-editor-item .btn-sm{flex-shrink:0}

/* responsive */
@media(max-width:768px){
  .sidebar{display:none}
  .main{margin-left:0}
  .editor-wrap{flex-direction:column;height:auto}
  .editor-pane textarea{min-height:300px}
  .preview-pane{min-height:200px}
  .editor-meta{grid-template-columns:1fr}
}
`;

/* ================================================================
   ADMIN JS — Complete SPA
   ================================================================ */
const adminJS = `
(function(){
'use strict';

/* ---------- Admin i18n ---------- */
var _adminLang = localStorage.getItem('admin_lang') || 'zh';
var _i18n = {
  // Login
  'login.title':       {zh:'博客管理',       en:'Blog Admin'},
  'login.username':    {zh:'用户名',         en:'Username'},
  'login.password':    {zh:'密码',           en:'Password'},
  'login.signin':      {zh:'登录',           en:'Sign In'},
  'login.signing_in':  {zh:'登录中...',      en:'Signing in...'},
  'login.failed':      {zh:'登录失败',       en:'Login failed'},
  // Shell
  'shell.admin':       {zh:'管理面板',       en:'Admin'},
  'nav.dashboard':     {zh:'仪表盘',         en:'Dashboard'},
  'nav.articles':      {zh:'文章',           en:'Articles'},
  'nav.categories':    {zh:'分类',           en:'Categories'},
  'nav.tags':          {zh:'标签',           en:'Tags'},
  'nav.comments':      {zh:'评论',           en:'Comments'},
  'nav.settings':      {zh:'设置',           en:'Settings'},
  'shell.view_blog':   {zh:'查看博客',       en:'View Blog'},
  'shell.theme':       {zh:'切换主题',       en:'Toggle Theme'},
  'shell.logout':      {zh:'退出登录',       en:'Logout'},
  'shell.lang':        {zh:'EN',             en:'中'},
  // Dashboard
  'dash.articles':     {zh:'文章数',         en:'Articles'},
  'dash.pending':      {zh:'待审评论',       en:'Pending Comments'},
  'dash.reads':        {zh:'总阅读',         en:'Total Reads'},
  'dash.likes':        {zh:'总点赞',         en:'Total Likes'},
  'dash.popular':      {zh:'热门文章',       en:'Popular Articles'},
  // Table headers
  'th.title':          {zh:'标题',           en:'Title'},
  'th.status':         {zh:'状态',           en:'Status'},
  'th.date':           {zh:'日期',           en:'Date'},
  'th.reads':          {zh:'阅读',           en:'Reads'},
  'th.likes':          {zh:'点赞',           en:'Likes'},
  'th.comments':       {zh:'评论',           en:'Comments'},
  'th.actions':        {zh:'操作',           en:'Actions'},
  'th.name':           {zh:'名称',           en:'Name'},
  'th.slug':           {zh:'别名',           en:'Slug'},
  'th.desc':           {zh:'描述',           en:'Description'},
  'th.order':          {zh:'排序',           en:'Order'},
  'th.articles':       {zh:'文章数',         en:'Articles'},
  // Status
  'status.published':  {zh:'已发布',         en:'Published'},
  'status.draft':      {zh:'草稿',           en:'Draft'},
  'status.all':        {zh:'全部状态',       en:'All Status'},
  'status.approved':   {zh:'已通过',         en:'Approved'},
  'status.pending':    {zh:'待审核',         en:'Pending'},
  'status.rejected':   {zh:'已拒绝',         en:'Rejected'},
  // Actions
  'act.new_article':   {zh:'+ 新建文章',     en:'+ New Article'},
  'act.new_cat':       {zh:'+ 新建分类',     en:'+ New Category'},
  'act.new_tag':       {zh:'+ 新建标签',     en:'+ New Tag'},
  'act.publish':       {zh:'发布',           en:'Publish'},
  'act.unpublish':     {zh:'撤回',           en:'Unpublish'},
  'act.delete':        {zh:'删除',           en:'Delete'},
  'act.edit':          {zh:'编辑',           en:'Edit'},
  'act.save':          {zh:'保存',           en:'Save'},
  'act.cancel':        {zh:'取消',           en:'Cancel'},
  'act.approve':       {zh:'通过',           en:'Approve'},
  'act.reject':        {zh:'拒绝',           en:'Reject'},
  // Editor
  'ed.new':            {zh:'新建文章',       en:'New Article'},
  'ed.edit':           {zh:'编辑文章',       en:'Edit Article'},
  'ed.title':          {zh:'标题',           en:'Title'},
  'ed.slug_auto':      {zh:'(自动生成)',     en:'(auto from title)'},
  'ed.cover':          {zh:'封面图片 URL',   en:'Cover Image URL'},
  'ed.excerpt':        {zh:'摘要',           en:'Excerpt'},
  'ed.excerpt_auto':   {zh:'(留空自动生成)', en:'(auto if empty)'},
  'ed.categories':     {zh:'分类',           en:'Categories'},
  'ed.tags':           {zh:'标签',           en:'Tags'},
  'ed.loading':        {zh:'加载中...',      en:'Loading...'},
  'ed.placeholder':    {zh:'用 Markdown 写文章...', en:'Write your article in Markdown...'},
  'ed.save_draft':     {zh:'保存草稿',       en:'Save Draft'},
  'ed.save_publish':   {zh:'保存并发布',     en:'Save & Publish'},
  'ed.required':       {zh:'标题和内容不能为空', en:'Title and content required'},
  'ed.published':      {zh:'已发布！',       en:'Published!'},
  'ed.saved':          {zh:'已保存！',       en:'Saved!'},
  'ed.save_fail':      {zh:'保存失败',       en:'Save failed'},
  'ed.not_found':      {zh:'文章未找到',     en:'Article not found'},
  'ed.none_avail':     {zh:'暂无可选',       en:'None available'},
  'ed.words':          {zh:'字',             en:'words'},
  'ed.chars':          {zh:'字符',           en:'chars'},
  'ed.lines':          {zh:'行',             en:'lines'},
  'ed.auto_saved':     {zh:'自动保存于 ',    en:'Auto-saved '},
  'ed.saved_at':       {zh:'已保存于 ',      en:'Saved '},
  'ed.preview_hint':   {zh:'预览区',         en:'Preview will appear here...'},
  // MD toolbar
  'tb.bold':           {zh:'粗体 (Ctrl+B)',  en:'Bold (Ctrl+B)'},
  'tb.italic':         {zh:'斜体 (Ctrl+I)',  en:'Italic (Ctrl+I)'},
  'tb.strike':         {zh:'删除线',         en:'Strikethrough'},
  'tb.h1':             {zh:'一级标题',       en:'Heading 1'},
  'tb.h2':             {zh:'二级标题',       en:'Heading 2'},
  'tb.h3':             {zh:'三级标题',       en:'Heading 3'},
  'tb.ul':             {zh:'无序列表',       en:'Bullet List'},
  'tb.ol':             {zh:'有序列表',       en:'Numbered List'},
  'tb.task':           {zh:'任务列表',       en:'Task List'},
  'tb.quote':          {zh:'引用',           en:'Blockquote'},
  'tb.code':           {zh:'行内代码',       en:'Inline Code'},
  'tb.codeblock':      {zh:'代码块',         en:'Code Block'},
  'tb.link':           {zh:'链接 (Ctrl+K)',  en:'Link (Ctrl+K)'},
  'tb.image':          {zh:'图片',           en:'Image'},
  'tb.table':          {zh:'表格',           en:'Table'},
  'tb.hr':             {zh:'水平线',         en:'Horizontal Rule'},
  'tb.guide':          {zh:'Markdown 指南',  en:'Markdown Guide'},
  'tb.guide_title':    {zh:'Markdown 快速参考', en:'Markdown Quick Reference'},
  // Categories
  'cat.title':         {zh:'分类',           en:'Categories'},
  'cat.new':           {zh:'新建分类',       en:'New Category'},
  'cat.edit':          {zh:'编辑分类',       en:'Edit Category'},
  'cat.empty':         {zh:'暂无分类',       en:'No categories'},
  'cat.sort':          {zh:'排序',           en:'Sort Order'},
  'cat.name_slug_req': {zh:'名称和别名不能为空', en:'Name and slug required'},
  // Tags
  'tag.title':         {zh:'标签',           en:'Tags'},
  'tag.new':           {zh:'新建标签',       en:'New Tag'},
  'tag.edit':          {zh:'编辑标签',       en:'Edit Tag'},
  'tag.empty':         {zh:'暂无标签',       en:'No tags'},
  'tag.name_slug_req': {zh:'名称和别名不能为空', en:'Name and slug required'},
  // Comments
  'cmt.title':         {zh:'评论',           en:'Comments'},
  'cmt.all':           {zh:'全部',           en:'All'},
  'cmt.empty':         {zh:'暂无评论',       en:'No comments'},
  'cmt.on':            {zh:'来自',           en:'on'},
  'cmt.confirm_del':   {zh:'确认删除？',     en:'Delete?'},
  // Settings
  'set.title':         {zh:'设置',           en:'Settings'},
  'set.general':       {zh:'基本信息',       en:'General'},
  'set.site_title':    {zh:'站点标题',       en:'Site Title'},
  'set.subtitle':      {zh:'副标题',         en:'Subtitle'},
  'set.description':   {zh:'描述',           en:'Description'},
  'set.logo':          {zh:'Logo URL',       en:'Logo URL'},
  'set.content':       {zh:'内容设置',       en:'Content'},
  'set.ppp':           {zh:'每页文章数',     en:'Posts Per Page'},
  'set.moderation':    {zh:'评论审核',       en:'Comment Moderation'},
  'set.enabled':       {zh:'开启',           en:'Enabled'},
  'set.disabled':      {zh:'关闭',           en:'Disabled'},
  'set.footer':        {zh:'页脚内容',       en:'Footer Content'},
  'set.nav_menu':      {zh:'导航菜单',       en:'Navigation Menu'},
  'set.nav_hint':      {zh:'每行一个，格式：名称|URL', en:'One per line, format: Label|URL'},
  'set.social':        {zh:'社交链接',       en:'Social Links'},
  'set.about':         {zh:'关于页面',       en:'About Page'},
  'set.about_hint':    {zh:'/about 页面的 Markdown 内容', en:'Markdown content for the /about page'},
  'set.save':          {zh:'保存设置',       en:'Save Settings'},
  'set.saved':         {zh:'设置已保存！',   en:'Settings saved!'},
  // Articles page
  'art.empty':         {zh:'暂无文章',       en:'No articles found'},
  // Common
  'common.page':       {zh:'第',             en:'Page'},
  'common.of':         {zh:'/',              en:'/'},
  'common.prev':       {zh:'上一页',         en:'Prev'},
  'common.next':       {zh:'下一页',         en:'Next'},
  'common.network_err':{zh:'网络错误',       en:'Network error'},
  'common.error':      {zh:'操作失败',       en:'Error'},
  'common.deleted':    {zh:'已删除',         en:'Deleted'},
  'common.updated':    {zh:'已更新',         en:'Updated'},
  'common.created':    {zh:'已创建',         en:'Created'},
  'common.done':       {zh:'完成',           en:'Done'},
  'common.confirm_del':{zh:'确认删除？',     en:'Delete this item?'},
};
function L(k) { var e = _i18n[k]; return e ? (e[_adminLang] || e['en'] || k) : k; }
function setAdminLang(lang) { _adminLang = lang; localStorage.setItem('admin_lang', lang); }

/* ---------- API Client ---------- */
var API = {
  token: localStorage.getItem('admin_token') || '',

  headers: function(json) {
    var h = { 'Authorization': 'Bearer ' + this.token };
    if (json) h['Content-Type'] = 'application/json';
    return h;
  },

  get: function(url) {
    return fetch(url, { headers: this.headers() }).then(this._handle.bind(this));
  },

  post: function(url, body) {
    return fetch(url, { method: 'POST', headers: this.headers(true), body: JSON.stringify(body) }).then(this._handle.bind(this));
  },

  put: function(url, body) {
    return fetch(url, { method: 'PUT', headers: this.headers(true), body: JSON.stringify(body) }).then(this._handle.bind(this));
  },

  del: function(url) {
    return fetch(url, { method: 'DELETE', headers: this.headers() }).then(this._handle.bind(this));
  },

  _handle: function(r) {
    if (r.status === 401) { this.token = ''; localStorage.removeItem('admin_token'); Router.go('login'); throw new Error('Unauthorized'); }
    return r.json();
  }
};

/* ---------- Toast ---------- */
var toastWrap;
function toast(msg, type) {
  if (!toastWrap) { toastWrap = document.createElement('div'); toastWrap.className = 'toast-wrap'; document.body.appendChild(toastWrap); }
  var el = document.createElement('div');
  el.className = 'toast toast-' + (type || 'success');
  el.textContent = msg;
  toastWrap.appendChild(el);
  setTimeout(function() { el.remove(); }, 3000);
}

/* ---------- Util ---------- */
function $(sel, ctx) { return (ctx || document).querySelector(sel); }
function $$(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }
function esc(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
function fmtDate(s) { if (!s) return '-'; return s.substring(0, 10); }

/* ---------- Simple Markdown Preview ---------- */
function mdPreview(src) {
  if (!src) return '<p style="color:var(--color-text-tertiary)">' + L('ed.preview_hint') + '</p>';
  var h = src
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\\*\\*(.+?)\\*\\*/g, '<strong>$1</strong>')
    .replace(/\\*(.+?)\\*/g, '<em>$1</em>')
    .replace(/~~(.+?)~~/g, '<del>$1</del>')
    .replace(/\`\`\`([\\\\s\\\\S]*?)\`\`\`/g, '<pre><code>$1</code></pre>')
    .replace(/\`([^\`]+)\`/g, '<code>$1</code>')
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/!\\[([^\\]]*)\\]\\(([^)]+)\\)/g, '<img src="$2" alt="$1" style="max-width:100%">')
    .replace(/\\[([^\\]]+)\\]\\(([^)]+)\\)/g, '<a href="$2">$1</a>')
    .replace(/^---$/gm, '<hr>')
    .replace(/^\\|(.+)\\|$/gm, function(m,row){ return '<tr>' + row.split('|').map(function(c){return '<td>'+c.trim()+'</td>';}).join('') + '</tr>'; })
    .replace(/^- \\[x\\] (.+)$/gm, '<li style="list-style:none"><input type="checkbox" checked disabled> $1</li>')
    .replace(/^- \\[ \\] (.+)$/gm, '<li style="list-style:none"><input type="checkbox" disabled> $1</li>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/^(\\d+)\\. (.+)$/gm, '<li>$2</li>')
    .replace(/(<li>.*<\\/li>)/s, '<ul>$1</ul>')
    .replace(/\\n\\n/g, '</p><p>')
    .replace(/\\n/g, '<br>');
  return '<p>' + h + '</p>';
}

/* ---------- Word count helper ---------- */
function wordCount(text) {
  if (!text) return { chars: 0, words: 0, lines: 0 };
  var chars = text.length;
  var cn = (text.match(/[\\u4e00-\\u9fff]/g) || []).length;
  var en = text.replace(/[\\u4e00-\\u9fff]/g, '').split(/\\s+/).filter(function(w){return w.length>0;}).length;
  var lines = text.split('\\n').length;
  return { chars: chars, words: cn + en, lines: lines };
}

/* ---------- MD Toolbar Insert Helper ---------- */
function mdInsert(ta, before, after, placeholder) {
  var start = ta.selectionStart;
  var end = ta.selectionEnd;
  var sel = ta.value.substring(start, end);
  var text = sel || placeholder || '';
  var val = ta.value;
  ta.value = val.substring(0, start) + before + text + (after||'') + val.substring(end);
  ta.focus();
  if (!sel) {
    ta.selectionStart = start + before.length;
    ta.selectionEnd = start + before.length + text.length;
  } else {
    ta.selectionStart = start;
    ta.selectionEnd = start + before.length + text.length + (after||'').length;
  }
  ta.dispatchEvent(new Event('input'));
}

function mdInsertLine(ta, prefix) {
  var start = ta.selectionStart;
  var val = ta.value;
  var lineStart = val.lastIndexOf('\\n', start - 1) + 1;
  ta.value = val.substring(0, lineStart) + prefix + val.substring(lineStart);
  ta.focus();
  ta.selectionStart = ta.selectionEnd = start + prefix.length;
  ta.dispatchEvent(new Event('input'));
}

/* ---------- Slug generator ---------- */
function autoSlug(title) {
  return title.trim().toLowerCase()
    .replace(/[\\s_]+/g, '-')
    .replace(/[^\\w\\u4e00-\\u9fff\\u3400-\\u4dbf-]/g, '')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '');
}

/* ---------- Router ---------- */
var Router = {
  routes: {},
  current: '',

  on: function(path, handler) { this.routes[path] = handler; },

  go: function(path) {
    window.location.hash = '#/' + path;
  },

  start: function() {
    var self = this;
    function handle() {
      var hash = window.location.hash.replace('#/', '') || 'dashboard';
      self.current = hash;
      var parts = hash.split('/');
      var route = parts[0];
      var param = parts[1] || null;
      var param2 = parts[2] || null;

      if (self.routes[hash]) {
        self.routes[hash]();
      } else if (param2 && self.routes[route + '/:id/' + param2]) {
        self.routes[route + '/:id/' + param2](param);
      } else if (param && self.routes[route + '/:id']) {
        self.routes[route + '/:id'](param);
      } else if (self.routes[route]) {
        self.routes[route]();
      } else {
        self.routes['dashboard']();
      }
    }
    window.addEventListener('hashchange', handle);
    handle();
  }
};

/* ---------- App Mount ---------- */
var root = document.getElementById('app');

function setPage(html) { root.innerHTML = html; }

/* ==================================================================
   LOGIN
   ================================================================== */
function renderLogin() {
  setPage(
    '<div class="login-wrap"><div class="login-box">' +
    '<h1>' + L('login.title') + '</h1>' +
    '<div class="fg"><label>' + L('login.username') + '</label><input type="text" id="lg-user" autocomplete="username"></div>' +
    '<div class="fg"><label>' + L('login.password') + '</label><input type="password" id="lg-pass" autocomplete="current-password"></div>' +
    '<button class="btn btn-primary btn-w" id="lg-btn">' + L('login.signin') + '</button>' +
    '<div class="err-msg" id="lg-err" style="display:none"></div>' +
    '</div></div>'
  );
  var btn = $('#lg-btn');
  var errEl = $('#lg-err');
  function doLogin() {
    var u = $('#lg-user').value, p = $('#lg-pass').value;
    errEl.style.display = 'none';
    btn.disabled = true; btn.textContent = L('login.signing_in');
    fetch('/api/auth/login', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({username:u, password:p})
    })
    .then(function(r){ return r.json(); })
    .then(function(d){
      if (d.success) {
        API.token = d.data.accessToken;
        localStorage.setItem('admin_token', API.token);
        Router.go('dashboard');
      } else {
        errEl.textContent = d.error ? d.error.message : L('login.failed');
        errEl.style.display = 'block';
      }
    })
    .catch(function(){ errEl.textContent = L('common.network_err'); errEl.style.display = 'block'; })
    .finally(function(){ btn.disabled = false; btn.textContent = L('login.signin'); });
  }
  btn.onclick = doLogin;
  $('#lg-pass').onkeydown = function(e) { if (e.key === 'Enter') doLogin(); };
}

/* ==================================================================
   SHELL (Sidebar + Topbar + Content)
   ================================================================== */
function shell(title, contentHtml) {
  return '<div class="shell">' +
    '<aside class="sidebar">' +
      '<div class="sidebar-brand"><span class="dot"></span> ' + L('shell.admin') + '</div>' +
      '<nav>' +
        navItem('dashboard', L('nav.dashboard'), iconDashboard) +
        navItem('articles', L('nav.articles'), iconArticle) +
        navItem('categories', L('nav.categories'), iconCategory) +
        navItem('tags', L('nav.tags'), iconTag) +
        navItem('comments', L('nav.comments'), iconComment) +
        navItem('settings', L('nav.settings'), iconSettings) +
      '</nav>' +
      '<div class="sidebar-footer">' +
        '<a href="/" target="_blank">' + L('shell.view_blog') + ' &rarr;</a>' +
        '<a href="#" id="theme-tog">' + L('shell.theme') + '</a>' +
        '<a href="#" id="lang-tog">' + L('shell.lang') + '</a>' +
        '<a href="#" id="logout-link">' + L('shell.logout') + '</a>' +
      '</div>' +
    '</aside>' +
    '<div class="main">' +
      '<header class="topbar"><h2>' + esc(title) + '</h2><div class="topbar-actions" id="topbar-actions"></div></header>' +
      '<div class="page" id="page-content">' + contentHtml + '</div>' +
    '</div>' +
  '</div>';
}

function navItem(route, label, icon) {
  var active = Router.current.split('/')[0] === route ? ' active' : '';
  return '<a href="#/' + route + '" class="nav-item' + active + '">' + icon + ' ' + label + '</a>';
}

function bindShell() {
  var tt = $('#theme-tog');
  if (tt) tt.onclick = function(e) {
    e.preventDefault();
    var r = document.documentElement;
    var c = r.getAttribute('data-theme');
    var n = c === 'dark' ? 'light' : 'dark';
    r.setAttribute('data-theme', n);
    localStorage.setItem('theme', n);
  };
  var lt = $('#lang-tog');
  if (lt) lt.onclick = function(e) {
    e.preventDefault();
    var newLang = _adminLang === 'zh' ? 'en' : 'zh';
    setAdminLang(newLang);
    document.documentElement.lang = newLang === 'zh' ? 'zh-CN' : 'en';
    var hash = window.location.hash || '#/dashboard';
    window.location.hash = '';
    setTimeout(function(){ window.location.hash = hash; }, 10);
  };
  var lo = $('#logout-link');
  if (lo) lo.onclick = function(e) {
    e.preventDefault();
    API.token = '';
    localStorage.removeItem('admin_token');
    Router.go('login');
  };
}

/* ---------- SVG Icons ---------- */
var iconDashboard = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>';
var iconArticle = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>';
var iconCategory = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>';
var iconTag = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>';
var iconComment = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>';
var iconSettings = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>';

/* ==================================================================
   DASHBOARD
   ================================================================== */
function renderDashboard() {
  setPage(shell(L('nav.dashboard'), '<div class="stats" id="stats-area"></div><div id="popular-area"></div>'));
  bindShell();
  API.get('/api/analytics/overview').then(function(d) {
    if (!d.success) return;
    var s = d.data;
    $('#stats-area').innerHTML =
      statCard(L('dash.articles'), s.total_articles) +
      statCard(L('dash.pending'), s.pending_comments) +
      statCard(L('dash.reads'), s.total_reads) +
      statCard(L('dash.likes'), s.total_likes);
  });
  API.get('/api/analytics/popular').then(function(d) {
    if (!d.success || !d.data.length) return;
    var rows = d.data.map(function(a) {
      return '<tr><td><a href="#/articles/' + a.id + '/edit">' + esc(a.title) + '</a></td><td>' + (a.read_count||0) + '</td><td>' + (a.like_count||0) + '</td></tr>';
    }).join('');
    $('#popular-area').innerHTML =
      '<h3 style="font-family:var(--font-display);margin-bottom:var(--space-3)">' + L('dash.popular') + '</h3>' +
      '<table class="tbl"><thead><tr><th>' + L('th.title') + '</th><th>' + L('th.reads') + '</th><th>' + L('th.likes') + '</th></tr></thead><tbody>' + rows + '</tbody></table>';
  });
}

function statCard(label, value) {
  return '<div class="stat"><div class="sl">' + label + '</div><div class="sv">' + (value || 0) + '</div></div>';
}

/* ==================================================================
   ARTICLES LIST
   ================================================================== */
function renderArticles() {
  setPage(shell(L('nav.articles'),
    '<div class="toolbar">' +
      '<select id="art-status"><option value="">' + L('status.all') + '</option><option value="published">' + L('status.published') + '</option><option value="draft">' + L('status.draft') + '</option></select>' +
      '<div style="margin-left:auto"><a href="#/articles/new" class="btn btn-primary">' + L('act.new_article') + '</a></div>' +
    '</div>' +
    '<div id="art-list"></div><div id="art-pager"></div>'
  ));
  bindShell();
  var currentPage = 1;
  var status = '';

  function load() {
    var url = '/api/articles?page=' + currentPage + '&pageSize=15';
    if (status) url += '&status=' + status;
    API.get(url).then(function(d) {
      if (!d.success) return;
      var articles = d.data;
      if (!articles.length) {
        $('#art-list').innerHTML = '<div class="empty"><p>' + L('art.empty') + '</p></div>';
        $('#art-pager').innerHTML = '';
        return;
      }
      var rows = articles.map(function(a) {
        var badge = a.status === 'published'
          ? '<span class="badge badge-green">' + L('status.published') + '</span>'
          : '<span class="badge badge-yellow">' + L('status.draft') + '</span>';
        return '<tr>' +
          '<td><a href="#/articles/' + a.id + '/edit"><strong>' + esc(a.title) + '</strong></a></td>' +
          '<td>' + badge + '</td>' +
          '<td>' + fmtDate(a.published_at || a.created_at) + '</td>' +
          '<td>' + (a.read_count||0) + '</td>' +
          '<td>' + (a.comment_count||0) + '</td>' +
          '<td class="actions">' +
            (a.status==='draft' ? '<button class="btn btn-sm btn-success pub-btn" data-id="'+a.id+'">' + L('act.publish') + '</button>' : '<button class="btn btn-sm btn-ghost unpub-btn" data-id="'+a.id+'">' + L('act.unpublish') + '</button>') +
            ' <button class="btn btn-sm btn-danger del-btn" data-id="'+a.id+'">' + L('act.delete') + '</button>' +
          '</td></tr>';
      }).join('');
      $('#art-list').innerHTML =
        '<table class="tbl"><thead><tr><th>' + L('th.title') + '</th><th>' + L('th.status') + '</th><th>' + L('th.date') + '</th><th>' + L('th.reads') + '</th><th>' + L('th.comments') + '</th><th>' + L('th.actions') + '</th></tr></thead><tbody>' + rows + '</tbody></table>';

      // Pager
      var pg = d.pagination;
      if (pg && pg.totalPages > 1) {
        $('#art-pager').innerHTML =
          '<div class="pager">' +
            '<span>' + L('common.page') + ' ' + pg.page + ' ' + L('common.of') + ' ' + pg.totalPages + '</span>' +
            (pg.page > 1 ? '<button class="btn btn-sm btn-ghost" id="pg-prev">&larr; ' + L('common.prev') + '</button>' : '') +
            (pg.page < pg.totalPages ? '<button class="btn btn-sm btn-ghost" id="pg-next">' + L('common.next') + ' &rarr;</button>' : '') +
          '</div>';
        var pp = $('#pg-prev'); if(pp) pp.onclick = function(){ currentPage--; load(); };
        var pn = $('#pg-next'); if(pn) pn.onclick = function(){ currentPage++; load(); };
      } else {
        $('#art-pager').innerHTML = '';
      }

      // Bind actions
      $$('.pub-btn').forEach(function(b){ b.onclick = function(){ apiPost('/api/articles/'+b.dataset.id+'/publish', load); }; });
      $$('.unpub-btn').forEach(function(b){ b.onclick = function(){ apiPost('/api/articles/'+b.dataset.id+'/unpublish', load); }; });
      $$('.del-btn').forEach(function(b){ b.onclick = function(){ if(confirm(L('common.confirm_del'))) API.del('/api/articles/'+b.dataset.id).then(function(d){ if(d.success){toast(L('common.deleted'));load();}else{toast(d.error?.message||L('common.error'),'error');} }); }; });
    });
  }

  function apiPost(url, cb) {
    API.post(url, {}).then(function(d){ if(d.success){toast(L('common.done'));cb();}else{toast(d.error?.message||L('common.error'),'error');} });
  }

  $('#art-status').onchange = function(){ status = this.value; currentPage = 1; load(); };
  load();
}

/* ==================================================================
   ARTICLE EDITOR (New / Edit) - Enhanced with toolbar, pickers, auto-save
   ================================================================== */
function renderArticleEditor(id) {
  var isNew = !id || id === 'new';

  var toolbarHtml =
    '<div class="md-toolbar" id="md-toolbar">' +
      tbBtn('B',L('tb.bold'),'<b>B</b>') +
      tbBtn('I',L('tb.italic'),'<i>I</i>') +
      tbBtn('S',L('tb.strike'),'<s>S</s>') +
      '<span class="sep"></span>' +
      tbBtn('H1',L('tb.h1'),'H1') +
      tbBtn('H2',L('tb.h2'),'H2') +
      tbBtn('H3',L('tb.h3'),'H3') +
      '<span class="sep"></span>' +
      tbBtn('UL',L('tb.ul'),'&bull;') +
      tbBtn('OL',L('tb.ol'),'1.') +
      tbBtn('TASK',L('tb.task'),'&check;') +
      tbBtn('QUOTE',L('tb.quote'),'&ldquo;') +
      '<span class="sep"></span>' +
      tbBtn('CODE',L('tb.code'),'&lt;&gt;') +
      tbBtn('CODEBLOCK',L('tb.codeblock'),'{ }') +
      tbBtn('LINK',L('tb.link'),'&#128279;') +
      tbBtn('IMG',L('tb.image'),'&#128247;') +
      tbBtn('TABLE',L('tb.table'),'&#9638;') +
      tbBtn('HR',L('tb.hr'),'&mdash;') +
      '<span class="sep"></span>' +
      tbBtn('GUIDE',L('tb.guide'),'?') +
    '</div>' +
    '<div class="md-guide" id="md-guide">' +
      '<b>' + L('tb.guide_title') + '</b><br>' +
      '<kbd>Ctrl+B</kbd> Bold &nbsp; <kbd>Ctrl+I</kbd> Italic &nbsp; <kbd>Ctrl+K</kbd> Link &nbsp; <kbd>Ctrl+S</kbd> Save<br>' +
      '<code># H1</code> <code>## H2</code> <code>### H3</code> &nbsp; <code>**bold**</code> <code>*italic*</code> <code>~~strike~~</code><br>' +
      '<code>- item</code> list &nbsp; <code>1. item</code> ordered &nbsp; <code>&gt; quote</code> blockquote &nbsp; <code>\\x60\\x60\\x60lang</code> code block<br>' +
      '<code>[text](url)</code> link &nbsp; <code>![alt](url)</code> image &nbsp; <code>| a | b |</code> table &nbsp; <code>---</code> hr' +
    '</div>';

  function tbBtn(action, tip, label) {
    return '<button type="button" data-action="'+action+'" title="'+tip+'">'+label+'</button>';
  }

  setPage(shell(isNew ? L('ed.new') : L('ed.edit'),
    '<div class="editor-meta" id="ed-meta">' +
      '<div class="fg"><label>' + L('ed.title') + '</label><input type="text" id="ed-title" placeholder="' + L('ed.title') + '"></div>' +
      '<div class="fg"><label>Slug <small style="color:var(--color-text-tertiary)">' + L('ed.slug_auto') + '</small></label><input type="text" id="ed-slug" placeholder="auto-generated-slug"></div>' +
      '<div class="fg"><label>' + L('ed.cover') + '</label><input type="text" id="ed-cover" placeholder="https://..."></div>' +
      '<div class="fg"><label>' + L('ed.excerpt') + ' <small style="color:var(--color-text-tertiary)">' + L('ed.excerpt_auto') + '</small></label><input type="text" id="ed-excerpt"></div>' +
      '<div class="fg" style="grid-column:1/-1"><label>' + L('ed.categories') + '</label><div class="picker-wrap" id="cat-picker"><span style="font-size:var(--text-xs);color:var(--color-text-tertiary)">' + L('ed.loading') + '</span></div></div>' +
      '<div class="fg" style="grid-column:1/-1"><label>' + L('ed.tags') + '</label><div class="picker-wrap" id="tag-picker"><span style="font-size:var(--text-xs);color:var(--color-text-tertiary)">' + L('ed.loading') + '</span></div></div>' +
    '</div>' +
    '<div class="editor-wrap">' +
      '<div class="editor-pane">' + toolbarHtml + '<textarea id="ed-md" placeholder="' + L('ed.placeholder') + '"></textarea></div>' +
      '<div class="editor-divider"></div>' +
      '<div class="preview-pane" id="ed-preview"></div>' +
    '</div>' +
    '<div class="editor-actions">' +
      '<button class="btn btn-primary" id="ed-save">' + L('ed.save_draft') + '</button>' +
      '<button class="btn btn-success" id="ed-publish">' + L('ed.save_publish') + '</button>' +
      '<a href="#/articles" class="btn btn-ghost">' + L('act.cancel') + '</a>' +
      '<span class="editor-status" id="ed-status">' +
        '<span id="ed-wc"></span>' +
        '<span id="ed-autosave"></span>' +
      '</span>' +
    '</div>'
  ));
  bindShell();

  var mdEl = $('#ed-md');
  var prevEl = $('#ed-preview');
  var debounce, autoSaveTimer;
  var selectedCats = [];
  var selectedTags = [];
  var allCats = [];
  var allTags = [];

  // --- Word count & preview ---
  function updatePreview() {
    prevEl.innerHTML = mdPreview(mdEl.value);
    var wc = wordCount(mdEl.value);
    var wcEl = $('#ed-wc');
    if (wcEl) wcEl.textContent = wc.words + ' ' + L('ed.words') + ' \\u00b7 ' + wc.chars + ' ' + L('ed.chars') + ' \\u00b7 ' + wc.lines + ' ' + L('ed.lines');
  }

  mdEl.oninput = function() {
    clearTimeout(debounce);
    debounce = setTimeout(updatePreview, 200);
    // Auto-save draft every 30s of inactivity
    clearTimeout(autoSaveTimer);
    if (!isNew) {
      autoSaveTimer = setTimeout(function() { save(false, true); }, 30000);
    }
  };

  // --- Auto-slug from title ---
  var slugManual = false;
  $('#ed-slug').oninput = function() { slugManual = true; };
  $('#ed-title').oninput = function() {
    if (!slugManual || !$('#ed-slug').value.trim()) {
      $('#ed-slug').value = autoSlug($('#ed-title').value);
      slugManual = false;
    }
  };

  // --- Toolbar actions ---
  var toolbar = $('#md-toolbar');
  if (toolbar) toolbar.addEventListener('click', function(e) {
    var btn = e.target.closest('button');
    if (!btn) return;
    var action = btn.dataset.action;
    switch(action) {
      case 'B': mdInsert(mdEl, '**', '**', 'bold text'); break;
      case 'I': mdInsert(mdEl, '*', '*', 'italic text'); break;
      case 'S': mdInsert(mdEl, '~~', '~~', 'deleted text'); break;
      case 'H1': mdInsertLine(mdEl, '# '); break;
      case 'H2': mdInsertLine(mdEl, '## '); break;
      case 'H3': mdInsertLine(mdEl, '### '); break;
      case 'UL': mdInsertLine(mdEl, '- '); break;
      case 'OL': mdInsertLine(mdEl, '1. '); break;
      case 'TASK': mdInsertLine(mdEl, '- [ ] '); break;
      case 'QUOTE': mdInsertLine(mdEl, '> '); break;
      case 'CODE': mdInsert(mdEl, '\\x60', '\\x60', 'code'); break;
      case 'CODEBLOCK': mdInsert(mdEl, '\\n\\x60\\x60\\x60\\n', '\\n\\x60\\x60\\x60\\n', 'code here'); break;
      case 'LINK': mdInsert(mdEl, '[', '](https://)', 'link text'); break;
      case 'IMG': mdInsert(mdEl, '![', '](https://)', 'alt text'); break;
      case 'TABLE': mdInsert(mdEl, '\\n| Column 1 | Column 2 | Column 3 |\\n|----------|----------|----------|\\n| ', ' | cell | cell |\\n', 'cell'); break;
      case 'HR': mdInsert(mdEl, '\\n---\\n', '', ''); break;
      case 'GUIDE':
        var g = $('#md-guide');
        if (g) g.classList.toggle('show');
        break;
    }
  });

  // --- Keyboard shortcuts ---
  mdEl.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey) {
      switch(e.key.toLowerCase()) {
        case 'b': e.preventDefault(); mdInsert(mdEl, '**', '**', 'bold'); break;
        case 'i': e.preventDefault(); mdInsert(mdEl, '*', '*', 'italic'); break;
        case 'k': e.preventDefault(); mdInsert(mdEl, '[', '](https://)', 'link text'); break;
        case 's': e.preventDefault(); save(false); break;
      }
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      mdInsert(mdEl, '  ', '', '');
    }
  });

  // --- Load categories and tags for pickers ---
  Promise.all([API.get('/api/categories'), API.get('/api/tags')]).then(function(results) {
    var catData = results[0], tagData = results[1];
    if (catData.success) {
      allCats = flattenCatTreeEditor(catData.data);
      renderPicker('cat-picker', allCats, selectedCats);
    }
    if (tagData.success) {
      allTags = tagData.data || [];
      renderPicker('tag-picker', allTags, selectedTags);
    }
  });

  function flattenCatTreeEditor(nodes, depth) {
    depth = depth || 0;
    var result = [];
    (nodes||[]).forEach(function(n) {
      n._depth = depth;
      result.push(n);
      if (n.children && n.children.length) result = result.concat(flattenCatTreeEditor(n.children, depth+1));
    });
    return result;
  }

  function renderPicker(containerId, items, selected) {
    var container = $('#' + containerId);
    if (!container) return;
    if (!items.length) { container.innerHTML = '<span style="font-size:var(--text-xs);color:var(--color-text-tertiary)">' + L('ed.none_avail') + '</span>'; return; }
    container.innerHTML = items.map(function(item) {
      var isSel = selected.indexOf(item.id) >= 0;
      var indent = item._depth ? '\\u00a0'.repeat(item._depth * 2) : '';
      return '<span class="picker-chip' + (isSel?' selected':'') + '" data-id="'+item.id+'">' + indent + esc(item.name) + '</span>';
    }).join('');
    container.onclick = function(e) {
      var chip = e.target.closest('.picker-chip');
      if (!chip) return;
      var cid = parseInt(chip.dataset.id);
      var idx = selected.indexOf(cid);
      if (idx >= 0) { selected.splice(idx, 1); chip.classList.remove('selected'); }
      else { selected.push(cid); chip.classList.add('selected'); }
    };
  }

  // If editing, load existing data
  if (!isNew) {
    API.get('/api/articles/' + id).then(function(d) {
      if (!d.success) { toast(L('ed.not_found'), 'error'); Router.go('articles'); return; }
      var a = d.data;
      $('#ed-title').value = a.title || '';
      $('#ed-slug').value = a.slug || '';
      if (a.slug) slugManual = true;
      $('#ed-cover').value = a.cover_image || '';
      $('#ed-excerpt').value = a.excerpt || '';
      selectedCats = (a.categories || []).map(function(c){return c.id;});
      selectedTags = (a.tags || []).map(function(t){return t.id;});
      if (allCats.length) renderPicker('cat-picker', allCats, selectedCats);
      if (allTags.length) renderPicker('tag-picker', allTags, selectedTags);
      mdEl.value = a.content_md || '';
      updatePreview();
      var asEl = $('#ed-autosave');
      if (asEl) asEl.textContent = a.status + ' \\u00b7 ' + fmtDate(a.updated_at);
    });
  }

  function getBody(withStatus) {
    var body = {
      title: $('#ed-title').value,
      content_md: mdEl.value,
    };
    var slug = $('#ed-slug').value.trim();
    if (slug) body.slug = slug;
    var cover = $('#ed-cover').value.trim();
    if (cover) body.cover_image = cover;
    var excerpt = $('#ed-excerpt').value.trim();
    if (excerpt) body.excerpt = excerpt;
    if (selectedCats.length) body.category_ids = selectedCats;
    if (selectedTags.length) body.tag_ids = selectedTags;
    if (withStatus) body.status = 'published';
    return body;
  }

  function save(publish, silent) {
    var body = getBody(publish);
    if (!body.title || !body.content_md) {
      if (!silent) toast(L('ed.required'), 'error');
      return;
    }

    var btn = publish ? $('#ed-publish') : $('#ed-save');
    if (!silent) btn.disabled = true;

    var promise;
    if (isNew) {
      promise = API.post('/api/articles', body);
    } else {
      promise = API.put('/api/articles/' + id, body);
    }

    promise.then(function(d) {
      if (d.success) {
        if (!silent) toast(publish ? L('ed.published') : L('ed.saved'));
        if (isNew) {
          Router.go('articles/' + d.data.id + '/edit');
        } else {
          if (publish) {
            API.post('/api/articles/' + id + '/publish', {}).then(function(){ if(!silent) toast(L('ed.published')); });
          }
          var asEl = $('#ed-autosave');
          if (asEl) asEl.textContent = (silent ? L('ed.auto_saved') : L('ed.saved_at')) + new Date().toLocaleTimeString();
        }
      } else {
        if (!silent) toast(d.error ? d.error.message : L('ed.save_fail'), 'error');
      }
    }).catch(function(){ if(!silent) toast(L('common.network_err'), 'error'); })
      .finally(function(){ if(!silent) btn.disabled = false; });
  }

  $('#ed-save').onclick = function() { save(false); };
  $('#ed-publish').onclick = function() { save(true); };
}

/* ==================================================================
   CATEGORIES
   ================================================================== */
function renderCategories() {
  setPage(shell(L('cat.title'),
    '<div class="toolbar"><button class="btn btn-primary" id="cat-new">' + L('act.new_cat') + '</button></div>' +
    '<div id="cat-list"></div>' +
    '<div class="modal-overlay" id="cat-modal" style="display:none">' +
      '<div class="modal">' +
        '<h3 id="cat-modal-title">' + L('cat.new') + '</h3>' +
        '<div class="fg"><label>' + L('th.name') + '</label><input type="text" id="cat-name"></div>' +
        '<div class="fg"><label>' + L('th.slug') + '</label><input type="text" id="cat-slug"></div>' +
        '<div class="fg"><label>' + L('th.desc') + '</label><input type="text" id="cat-desc"></div>' +
        '<div class="fg"><label>' + L('cat.sort') + '</label><input type="number" id="cat-sort" value="0"></div>' +
        '<div class="modal-actions">' +
          '<button class="btn btn-ghost" id="cat-cancel">' + L('act.cancel') + '</button>' +
          '<button class="btn btn-primary" id="cat-save">' + L('act.save') + '</button>' +
        '</div>' +
      '</div>' +
    '</div>'
  ));
  bindShell();
  var editingId = null;

  function load() {
    API.get('/api/categories').then(function(d) {
      if (!d.success) return;
      var cats = flattenTree(d.data);
      if (!cats.length) { $('#cat-list').innerHTML = '<div class="empty"><p>' + L('cat.empty') + '</p></div>'; return; }
      var rows = cats.map(function(c) {
        var indent = c._depth ? '<span style="padding-left:' + (c._depth * 20) + 'px;display:inline-block">' + (c._depth > 0 ? '&mdash; ' : '') + '</span>' : '';
        return '<tr><td>' + indent + esc(c.name) + '</td><td><code style="font-size:var(--text-xs)">' + esc(c.slug) + '</code></td><td>' + esc(c.description || '-') + '</td><td>' + c.sort_order + '</td><td class="actions"><button class="btn btn-sm btn-ghost cat-edit" data-id="'+c.id+'">' + L('act.edit') + '</button> <button class="btn btn-sm btn-danger cat-del" data-id="'+c.id+'">' + L('act.delete') + '</button></td></tr>';
      }).join('');
      $('#cat-list').innerHTML = '<table class="tbl"><thead><tr><th>' + L('th.name') + '</th><th>' + L('th.slug') + '</th><th>' + L('th.desc') + '</th><th>' + L('th.order') + '</th><th>' + L('th.actions') + '</th></tr></thead><tbody>' + rows + '</tbody></table>';

      $$('.cat-edit').forEach(function(b) {
        b.onclick = function() {
          editingId = parseInt(b.dataset.id);
          var c = cats.find(function(x){ return x.id === editingId; });
          if (!c) return;
          $('#cat-modal-title').textContent = L('cat.edit');
          $('#cat-name').value = c.name;
          $('#cat-slug').value = c.slug;
          $('#cat-desc').value = c.description || '';
          $('#cat-sort').value = c.sort_order;
          $('#cat-modal').style.display = 'flex';
        };
      });
      $$('.cat-del').forEach(function(b) {
        b.onclick = function() { if(confirm(L('common.confirm_del'))) API.del('/api/categories/'+b.dataset.id).then(function(d){if(d.success){toast(L('common.deleted'));load();}else toast(d.error?.message||L('common.error'),'error');}); };
      });
    });
  }

  function flattenTree(nodes, depth) {
    depth = depth || 0;
    var result = [];
    nodes.forEach(function(n) {
      n._depth = depth;
      result.push(n);
      if (n.children && n.children.length) {
        result = result.concat(flattenTree(n.children, depth + 1));
      }
    });
    return result;
  }

  $('#cat-new').onclick = function() {
    editingId = null;
    $('#cat-modal-title').textContent = L('cat.new');
    $('#cat-name').value = ''; $('#cat-slug').value = ''; $('#cat-desc').value = ''; $('#cat-sort').value = '0';
    $('#cat-modal').style.display = 'flex';
  };

  $('#cat-cancel').onclick = function() { $('#cat-modal').style.display = 'none'; };
  $('#cat-modal').onclick = function(e) { if (e.target === this) this.style.display = 'none'; };

  $('#cat-save').onclick = function() {
    var body = { name: $('#cat-name').value, slug: $('#cat-slug').value, description: $('#cat-desc').value, sort_order: parseInt($('#cat-sort').value) || 0 };
    if (!body.name || !body.slug) { toast(L('cat.name_slug_req'), 'error'); return; }
    var promise = editingId ? API.put('/api/categories/' + editingId, body) : API.post('/api/categories', body);
    promise.then(function(d) {
      if (d.success) { toast(editingId ? L('common.updated') : L('common.created')); $('#cat-modal').style.display = 'none'; load(); }
      else toast(d.error?.message || L('common.error'), 'error');
    });
  };

  load();
}

/* ==================================================================
   TAGS
   ================================================================== */
function renderTags() {
  setPage(shell(L('tag.title'),
    '<div class="toolbar"><button class="btn btn-primary" id="tag-new">' + L('act.new_tag') + '</button></div>' +
    '<div id="tag-list"></div>' +
    '<div class="modal-overlay" id="tag-modal" style="display:none">' +
      '<div class="modal">' +
        '<h3 id="tag-modal-title">' + L('tag.new') + '</h3>' +
        '<div class="fg"><label>' + L('th.name') + '</label><input type="text" id="tag-name"></div>' +
        '<div class="fg"><label>' + L('th.slug') + '</label><input type="text" id="tag-slug"></div>' +
        '<div class="modal-actions">' +
          '<button class="btn btn-ghost" id="tag-cancel">' + L('act.cancel') + '</button>' +
          '<button class="btn btn-primary" id="tag-save">' + L('act.save') + '</button>' +
        '</div>' +
      '</div>' +
    '</div>'
  ));
  bindShell();
  var editingId = null;

  function load() {
    API.get('/api/tags').then(function(d) {
      if (!d.success) return;
      var tags = d.data;
      if (!tags.length) { $('#tag-list').innerHTML = '<div class="empty"><p>' + L('tag.empty') + '</p></div>'; return; }
      var rows = tags.map(function(t) {
        return '<tr><td>' + esc(t.name) + '</td><td><code style="font-size:var(--text-xs)">' + esc(t.slug) + '</code></td><td>' + (t.article_count||0) + '</td><td class="actions"><button class="btn btn-sm btn-ghost tag-edit" data-id="'+t.id+'" data-name="'+esc(t.name)+'" data-slug="'+esc(t.slug)+'">' + L('act.edit') + '</button> <button class="btn btn-sm btn-danger tag-del" data-id="'+t.id+'">' + L('act.delete') + '</button></td></tr>';
      }).join('');
      $('#tag-list').innerHTML = '<table class="tbl"><thead><tr><th>' + L('th.name') + '</th><th>' + L('th.slug') + '</th><th>' + L('th.articles') + '</th><th>' + L('th.actions') + '</th></tr></thead><tbody>' + rows + '</tbody></table>';

      $$('.tag-edit').forEach(function(b) {
        b.onclick = function() {
          editingId = parseInt(b.dataset.id);
          $('#tag-modal-title').textContent = L('tag.edit');
          $('#tag-name').value = b.dataset.name;
          $('#tag-slug').value = b.dataset.slug;
          $('#tag-modal').style.display = 'flex';
        };
      });
      $$('.tag-del').forEach(function(b) {
        b.onclick = function() { if(confirm(L('common.confirm_del'))) API.del('/api/tags/'+b.dataset.id).then(function(d){if(d.success){toast(L('common.deleted'));load();}else toast(d.error?.message||L('common.error'),'error');}); };
      });
    });
  }

  $('#tag-new').onclick = function() {
    editingId = null;
    $('#tag-modal-title').textContent = L('tag.new');
    $('#tag-name').value = ''; $('#tag-slug').value = '';
    $('#tag-modal').style.display = 'flex';
  };

  $('#tag-cancel').onclick = function() { $('#tag-modal').style.display = 'none'; };
  $('#tag-modal').onclick = function(e) { if (e.target === this) this.style.display = 'none'; };

  $('#tag-save').onclick = function() {
    var body = { name: $('#tag-name').value, slug: $('#tag-slug').value };
    if (!body.name || !body.slug) { toast(L('tag.name_slug_req'), 'error'); return; }
    var promise = editingId ? API.put('/api/tags/' + editingId, body) : API.post('/api/tags', body);
    promise.then(function(d) {
      if (d.success) { toast(editingId ? L('common.updated') : L('common.created')); $('#tag-modal').style.display = 'none'; load(); }
      else toast(d.error?.message || L('common.error'), 'error');
    });
  };

  load();
}

/* ==================================================================
   COMMENTS
   ================================================================== */
function renderComments() {
  setPage(shell(L('cmt.title'),
    '<div class="toolbar">' +
      '<select id="cmt-status"><option value="">' + L('cmt.all') + '</option><option value="pending">' + L('status.pending') + '</option><option value="approved">' + L('status.approved') + '</option><option value="rejected">' + L('status.rejected') + '</option></select>' +
    '</div>' +
    '<div id="cmt-list"></div><div id="cmt-pager"></div>'
  ));
  bindShell();
  var page = 1, status = '';

  function load() {
    var url = '/api/comments?page=' + page;
    if (status) url += '&status=' + status;
    API.get(url).then(function(d) {
      if (!d.success) return;
      var comments = d.data;
      if (!comments.length) { $('#cmt-list').innerHTML = '<div class="empty"><p>' + L('cmt.empty') + '</p></div>'; return; }
      var html = comments.map(function(c) {
        var badge = c.status === 'approved' ? '<span class="badge badge-green">' + L('status.approved') + '</span>'
          : c.status === 'pending' ? '<span class="badge badge-yellow">' + L('status.pending') + '</span>'
          : '<span class="badge badge-red">' + L('status.rejected') + '</span>';
        var articleLink = c.article_slug ? '<a href="/article/' + esc(c.article_slug) + '" target="_blank">' + esc(c.article_title || 'Article') + '</a>' : '';
        return '<div class="comment-card">' +
          '<div class="cm-header">' +
            '<span class="cm-nick">' + esc(c.nickname) + '</span> ' + badge +
            '<span class="cm-time">' + fmtDate(c.created_at) + '</span>' +
            (articleLink ? ' <span class="cm-article">' + L('cmt.on') + ' ' + articleLink + '</span>' : '') +
          '</div>' +
          '<div class="cm-body">' + esc(c.content) + '</div>' +
          '<div class="cm-actions">' +
            (c.status !== 'approved' ? '<button class="btn btn-sm btn-success cmt-approve" data-id="'+c.id+'">' + L('act.approve') + '</button>' : '') +
            (c.status !== 'rejected' ? '<button class="btn btn-sm btn-ghost cmt-reject" data-id="'+c.id+'">' + L('act.reject') + '</button>' : '') +
            '<button class="btn btn-sm btn-danger cmt-del" data-id="'+c.id+'">' + L('act.delete') + '</button>' +
          '</div>' +
        '</div>';
      }).join('');
      $('#cmt-list').innerHTML = html;

      $$('.cmt-approve').forEach(function(b) { b.onclick = function(){ API.post('/api/comments/'+b.dataset.id+'/approve',{}).then(function(d){if(d.success){toast(L('status.approved'));load();}else toast(d.error?.message||L('common.error'),'error');}); }; });
      $$('.cmt-reject').forEach(function(b) { b.onclick = function(){ API.post('/api/comments/'+b.dataset.id+'/reject',{}).then(function(d){if(d.success){toast(L('status.rejected'));load();}else toast(d.error?.message||L('common.error'),'error');}); }; });
      $$('.cmt-del').forEach(function(b) { b.onclick = function(){ if(confirm(L('cmt.confirm_del'))) API.del('/api/comments/'+b.dataset.id).then(function(d){if(d.success){toast(L('common.deleted'));load();}else toast(d.error?.message||L('common.error'),'error');}); }; });

      // simple pager
      var total = d.total || 0;
      var totalPages = Math.ceil(total / 20);
      if (totalPages > 1) {
        $('#cmt-pager').innerHTML = '<div class="pager"><span>' + L('common.page') + ' '+page+' ' + L('common.of') + ' '+totalPages+'</span>' +
          (page>1?'<button class="btn btn-sm btn-ghost" id="cp-prev">&larr; ' + L('common.prev') + '</button>':'') +
          (page<totalPages?'<button class="btn btn-sm btn-ghost" id="cp-next">' + L('common.next') + ' &rarr;</button>':'') + '</div>';
        var pp=$('#cp-prev'); if(pp) pp.onclick=function(){page--;load();};
        var pn=$('#cp-next'); if(pn) pn.onclick=function(){page++;load();};
      } else { $('#cmt-pager').innerHTML = ''; }
    });
  }

  $('#cmt-status').onchange = function(){ status = this.value; page = 1; load(); };
  load();
}

/* ==================================================================
   SETTINGS
   ================================================================== */
function renderSettings() {
  setPage(shell(L('set.title'), '<div class="settings-grid" id="settings-form"><p>' + L('ed.loading') + '</p></div>'));
  bindShell();

  API.get('/api/settings').then(function(d) {
    if (!d.success) return;
    var s = d.data;
    var navMenuStr = (s.nav_menu || []).map(function(m){ return m.label + '|' + m.url; }).join('\\n');
    var socialStr = (s.social_links || []).map(function(l){ return l.label + '|' + l.url; }).join('\\n');

    $('#settings-form').innerHTML =
      '<div class="settings-section">' +
        '<h3>' + L('set.general') + '</h3>' +
        '<div class="fg"><label>' + L('set.site_title') + '</label><input type="text" id="st-title" value="' + esc(s.site_title||'') + '"></div>' +
        '<div class="fg"><label>' + L('set.subtitle') + '</label><input type="text" id="st-subtitle" value="' + esc(s.site_subtitle||'') + '"></div>' +
        '<div class="fg"><label>' + L('set.description') + '</label><textarea id="st-desc" rows="3">' + esc(s.site_description||'') + '</textarea></div>' +
        '<div class="fg"><label>' + L('set.logo') + '</label><input type="text" id="st-logo" value="' + esc(s.site_logo||'') + '"></div>' +
      '</div>' +
      '<div class="settings-section">' +
        '<h3>' + L('set.content') + '</h3>' +
        '<div class="fg"><label>' + L('set.ppp') + '</label><input type="number" id="st-ppp" value="' + (s.posts_per_page||10) + '"></div>' +
        '<div class="fg"><label>' + L('set.moderation') + '</label><select id="st-mod"><option value="true"' + (s.comment_moderation !== false ? ' selected' : '') + '>' + L('set.enabled') + '</option><option value="false"' + (s.comment_moderation === false ? ' selected' : '') + '>' + L('set.disabled') + '</option></select></div>' +
        '<div class="fg"><label>' + L('set.footer') + '</label><input type="text" id="st-footer" value="' + esc(s.footer_content||'') + '"></div>' +
      '</div>' +
      '<div class="settings-section">' +
        '<h3>' + L('set.nav_menu') + '</h3>' +
        '<p style="font-size:var(--text-xs);color:var(--color-text-tertiary);margin-bottom:var(--space-2)">' + L('set.nav_hint') + '</p>' +
        '<div class="fg"><textarea id="st-nav" rows="5">' + esc(navMenuStr) + '</textarea></div>' +
      '</div>' +
      '<div class="settings-section">' +
        '<h3>' + L('set.social') + '</h3>' +
        '<p style="font-size:var(--text-xs);color:var(--color-text-tertiary);margin-bottom:var(--space-2)">' + L('set.nav_hint') + '</p>' +
        '<div class="fg"><textarea id="st-social" rows="4">' + esc(socialStr) + '</textarea></div>' +
      '</div>' +
      '<div class="settings-section">' +
        '<h3>' + L('set.about') + '</h3>' +
        '<p style="font-size:var(--text-xs);color:var(--color-text-tertiary);margin-bottom:var(--space-2)">' + L('set.about_hint') + '</p>' +
        '<div class="fg"><textarea id="st-about" rows="12" style="font-family:var(--font-mono);font-size:var(--text-sm);line-height:1.6">' + esc(s.about_content||'') + '</textarea></div>' +
      '</div>' +
      '<div><button class="btn btn-primary" id="st-save">' + L('set.save') + '</button></div>';

    $('#st-save').onclick = function() {
      var navMenu = $('#st-nav').value.trim().split('\\n').filter(Boolean).map(function(l){
        var p = l.split('|'); return {label: p[0]||'', url: p[1]||'/'};
      });
      var socialLinks = $('#st-social').value.trim().split('\\n').filter(Boolean).map(function(l){
        var p = l.split('|'); return {label: p[0]||'', url: p[1]||'', icon:''};
      });

      var body = {
        site_title: $('#st-title').value,
        site_subtitle: $('#st-subtitle').value,
        site_description: $('#st-desc').value,
        site_logo: $('#st-logo').value,
        posts_per_page: parseInt($('#st-ppp').value) || 10,
        comment_moderation: $('#st-mod').value === 'true',
        footer_content: $('#st-footer').value,
        nav_menu: navMenu,
        social_links: socialLinks,
        about_content: $('#st-about').value,
      };

      var btn = $('#st-save');
      btn.disabled = true;
      API.put('/api/settings', body).then(function(d) {
        if (d.success) toast(L('set.saved'));
        else toast(d.error?.message || L('common.error'), 'error');
      }).finally(function(){ btn.disabled = false; });
    };
  });
}

/* ==================================================================
   INIT: Auth check + Route setup
   ================================================================== */
function init() {
  Router.on('login', renderLogin);
  Router.on('dashboard', renderDashboard);
  Router.on('articles', renderArticles);
  Router.on('articles/new', function() { renderArticleEditor(null); });
  Router.on('articles/:id/edit', function(id) { renderArticleEditor(id); });
  Router.on('categories', renderCategories);
  Router.on('tags', renderTags);
  Router.on('comments', renderComments);
  Router.on('settings', renderSettings);

  // Check auth
  if (!API.token) {
    Router.go('login');
    Router.start();
    return;
  }

  API.get('/api/auth/me').then(function(d) {
    if (!d.success) Router.go('login');
    Router.start();
  }).catch(function() {
    Router.go('login');
    Router.start();
  });
}

init();

})();
`;
