export interface Env {
  DB: D1Database;
  BLOG_KV: KVNamespace;
  JWT_SECRET: string;
  BLOG_ENV: string;
}

// Database row types
export interface AdminRow {
  id: number;
  username: string;
  password_hash: string;
  display_name: string;
  avatar_url: string;
  created_at: string;
  updated_at: string;
}

export interface ArticleRow {
  id: number;
  title: string;
  slug: string;
  content_md: string;
  content_html: string;
  excerpt: string;
  cover_image: string;
  status: 'draft' | 'published';
  published_at: string | null;
  read_count: number;
  like_count: number;
  comment_count: number;
  reading_time: number;
  created_at: string;
  updated_at: string;
}

export interface CategoryRow {
  id: number;
  name: string;
  slug: string;
  description: string;
  parent_id: number | null;
  sort_order: number;
  created_at: string;
}

export interface TagRow {
  id: number;
  name: string;
  slug: string;
  created_at: string;
}

export interface CommentRow {
  id: number;
  article_id: number;
  parent_id: number | null;
  nickname: string;
  email: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  ip_address: string;
  created_at: string;
}

export interface ArticleVersionRow {
  id: number;
  article_id: number;
  title: string;
  content_md: string;
  version_num: number;
  change_note: string;
  created_at: string;
}

export interface SettingRow {
  key: string;
  value: string;
  updated_at: string;
}

export interface LikeRow {
  id: number;
  article_id: number;
  ip_hash: string;
  created_at: string;
}

// API types
export interface SiteSettings {
  site_title: string;
  site_subtitle: string;
  site_description: string;
  site_logo: string;
  nav_menu: { label: string; url: string }[];
  footer_content: string;
  posts_per_page: number;
  comment_moderation: boolean;
  theme_colors: { primary: string; accent: string };
  social_links: { label: string; url: string; icon: string }[];
  about_content: string; // Markdown content for /about page
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface ArticleWithMeta extends ArticleRow {
  categories: CategoryRow[];
  tags: TagRow[];
}

export type { Locale } from './utils/i18n';
