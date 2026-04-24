// SEO helpers: JSON-LD structured data
import type { SiteSettings, ArticleWithMeta } from '../../env';
import { escapeHtml } from '../../utils/html';

export function renderBlogJsonLd(settings: SiteSettings, url: string): string {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: settings.site_title,
    description: settings.site_description,
    url,
  };
  return `<script type="application/ld+json">${JSON.stringify(ld)}</script>`;
}

export function renderArticleJsonLd(article: ArticleWithMeta, settings: SiteSettings, url: string): string {
  const ld: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.excerpt,
    datePublished: article.published_at,
    dateModified: article.updated_at,
    url,
    author: {
      '@type': 'Person',
      name: settings.site_title,
    },
    publisher: {
      '@type': 'Organization',
      name: settings.site_title,
    },
    wordCount: article.content_md.split(/\s+/).length,
    timeRequired: `PT${article.reading_time}M`,
  };
  if (article.cover_image) {
    ld.image = article.cover_image;
  }
  if (article.categories.length > 0) {
    ld.articleSection = article.categories[0].name;
  }
  if (article.tags.length > 0) {
    ld.keywords = article.tags.map(t => t.name).join(', ');
  }
  return `<script type="application/ld+json">${JSON.stringify(ld)}</script>`;
}
