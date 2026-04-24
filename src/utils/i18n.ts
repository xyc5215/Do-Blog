// Internationalization (i18n) support for zh/en

export type Locale = 'zh' | 'en';

const translations: Record<string, Record<Locale, string>> = {
  // Navigation
  'nav.home': { zh: '首页', en: 'Home' },
  'nav.about': { zh: '关于', en: 'About' },
  'nav.archive': { zh: '归档', en: 'Archive' },
  'nav.search': { zh: '搜索', en: 'Search' },
  'nav.toggle_theme': { zh: '切换主题', en: 'Toggle theme' },
  'nav.menu': { zh: '菜单', en: 'Menu' },

  // Footer
  'footer.navigation': { zh: '导航', en: 'Navigation' },
  'footer.connect': { zh: '联系', en: 'Connect' },
  'footer.rss': { zh: 'RSS 订阅', en: 'RSS Feed' },
  'footer.no_social': { zh: '暂无社交链接', en: 'No social links configured' },

  // Sidebar
  'sidebar.categories': { zh: '分类', en: 'Categories' },
  'sidebar.tags': { zh: '标签', en: 'Tags' },
  'sidebar.popular': { zh: '热门文章', en: 'Popular' },

  // Article card
  'article.min_read': { zh: '分钟阅读', en: 'min read' },
  'article.comments_count': { zh: '条评论', en: 'comments' },
  'article.no_articles': { zh: '暂无文章', en: 'No articles yet.' },
  'article.read_more': { zh: '阅读全文', en: 'Read Article' },
  'article.views': { zh: '次阅读', en: 'views' },

  // Article page
  'article.toc': { zh: '目录', en: 'Contents' },
  'article.prev': { zh: '上一篇', en: 'Previous' },
  'article.next': { zh: '下一篇', en: 'Next' },

  // Comments
  'comment.title': { zh: '评论', en: 'Comments' },
  'comment.empty': { zh: '暂无评论，来分享你的想法吧！', en: 'No comments yet. Be the first to share your thoughts!' },
  'comment.name': { zh: '昵称', en: 'Name' },
  'comment.email': { zh: '邮箱', en: 'Email' },
  'comment.placeholder': { zh: '写下你的评论...', en: 'Write your comment...' },
  'comment.submit': { zh: '提交评论', en: 'Submit Comment' },
  'comment.submitting': { zh: '提交中...', en: 'Submitting...' },
  'comment.success': { zh: '评论已提交，等待审核中。', en: 'Comment submitted! Awaiting moderation.' },
  'comment.fail': { zh: '提交失败，请重试。', en: 'Failed to submit comment.' },
  'comment.network_error': { zh: '网络错误，请重试。', en: 'Network error. Please try again.' },

  // Home
  'home.all_posts': { zh: '所有文章', en: 'All Posts' },
  'home.page_of': { zh: '第 {page} 页 / 共 {total} 页', en: 'Page {page} of {total}' },

  // Archive
  'archive.title': { zh: '归档', en: 'Archive' },
  'archive.count': { zh: '共 {count} 篇文章', en: '{count} articles in total' },
  'archive.empty': { zh: '暂无归档文章。', en: 'No archived articles yet.' },

  // Search
  'search.title': { zh: '搜索', en: 'Search' },
  'search.placeholder': { zh: '搜索文章...', en: 'Search articles...' },
  'search.results': { zh: '找到 {count} 条关于 "{query}" 的结果', en: 'Found {count} results for "{query}"' },
  'search.result_singular': { zh: '找到 1 条关于 "{query}" 的结果', en: 'Found 1 result for "{query}"' },

  // About
  'about.title': { zh: '关于', en: 'About' },

  // Error pages
  'error.not_found': { zh: '页面未找到', en: 'Page Not Found' },
  'error.not_found_desc': { zh: '您访问的页面不存在。', en: 'The page you are looking for does not exist.' },
  'error.article_not_found': { zh: '文章未找到', en: 'Article Not Found' },
  'error.article_not_found_desc': { zh: '您访问的文章不存在或已被删除。', en: 'The article you are looking for does not exist or has been removed.' },
  'error.category_not_found': { zh: '分类未找到', en: 'Category Not Found' },
  'error.category_not_found_desc': { zh: '该分类不存在。', en: 'This category does not exist.' },
  'error.tag_not_found': { zh: '标签未找到', en: 'Tag Not Found' },
  'error.tag_not_found_desc': { zh: '该标签不存在。', en: 'This tag does not exist.' },
  'error.back_home': { zh: '返回首页', en: 'Back to Home' },

  // Tag page
  'tag.articles_tagged': { zh: '{count} 篇相关文章', en: '{count} articles tagged' },
  'tag.article_tagged': { zh: '1 篇相关文章', en: '1 article tagged' },

  // Category page
  'category.articles_in': { zh: '分类：{name} 下的文章', en: 'Articles in {name}' },

  // Language
  'lang.switch': { zh: 'EN', en: '中' },
  'lang.label': { zh: 'English', en: '中文' },

  // Months
  'month.1': { zh: '一月', en: 'January' },
  'month.2': { zh: '二月', en: 'February' },
  'month.3': { zh: '三月', en: 'March' },
  'month.4': { zh: '四月', en: 'April' },
  'month.5': { zh: '五月', en: 'May' },
  'month.6': { zh: '六月', en: 'June' },
  'month.7': { zh: '七月', en: 'July' },
  'month.8': { zh: '八月', en: 'August' },
  'month.9': { zh: '九月', en: 'September' },
  'month.10': { zh: '十月', en: 'October' },
  'month.11': { zh: '十一月', en: 'November' },
  'month.12': { zh: '十二月', en: 'December' },

  // Relative time
  'time.just_now': { zh: '刚刚', en: 'Just now' },
  'time.minutes_ago': { zh: '{n}分钟前', en: '{n}m ago' },
  'time.hours_ago': { zh: '{n}小时前', en: '{n}h ago' },
  'time.days_ago': { zh: '{n}天前', en: '{n}d ago' },
};

/** Get translated string. Supports {placeholder} substitution. */
export function t(key: string, locale: Locale, params?: Record<string, string | number>): string {
  const entry = translations[key];
  let text = entry ? (entry[locale] ?? entry['zh'] ?? key) : key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    }
  }
  return text;
}

/** Detect locale from request: ?lang= > cookie > Accept-Language > default zh */
export function detectLocale(request: Request): Locale {
  const url = new URL(request.url);

  // 1. Query param ?lang=en
  const langParam = url.searchParams.get('lang');
  if (langParam === 'en' || langParam === 'zh') return langParam;

  // 2. Cookie
  const cookie = request.headers.get('Cookie') || '';
  const match = cookie.match(/(?:^|;\s*)blog_lang=(zh|en)/);
  if (match) return match[1] as Locale;

  // 3. Accept-Language header
  const acceptLang = request.headers.get('Accept-Language') || '';
  if (/^en/i.test(acceptLang)) return 'en';

  // 4. Default
  return 'zh';
}

/** Get locale name for html lang attribute */
export function htmlLang(locale: Locale): string {
  return locale === 'zh' ? 'zh-CN' : 'en';
}
