// Settings service: read/write site configuration
import type { Env, SiteSettings, SettingRow } from '../env';

const DEFAULT_SETTINGS: SiteSettings = {
  site_title: 'My Blog',
  site_subtitle: 'Thoughts, stories and ideas',
  site_description: 'A personal blog powered by Cloudflare Workers',
  site_logo: '',
  nav_menu: [
    { label: 'Home', url: '/' },
    { label: 'Archive', url: '/archive' },
    { label: 'About', url: '/about' },
  ],
  footer_content: 'Powered by CF Workers Blog',
  posts_per_page: 10,
  comment_moderation: true,
  theme_colors: { primary: '#E8590C', accent: '#3730A3' },
  social_links: [],
  about_content: '# About\n\nWelcome to my blog! Edit this page in the admin panel under Settings > About Page.',
};

export async function getSettings(env: Env): Promise<SiteSettings> {
  // Try KV cache first
  const cached = await env.BLOG_KV.get('config:settings', 'json');
  if (cached) return cached as SiteSettings;

  const rows = await env.DB.prepare('SELECT key, value FROM settings').all<SettingRow>();
  const settings: SiteSettings = { ...DEFAULT_SETTINGS };

  if (rows.results) {
    for (const row of rows.results) {
      try {
        const val = JSON.parse(row.value);
        (settings as any)[row.key] = val;
      } catch { /* skip malformed */ }
    }
  }

  // Cache indefinitely (invalidated on update)
  await env.BLOG_KV.put('config:settings', JSON.stringify(settings));
  return settings;
}

export async function updateSettings(env: Env, updates: Partial<SiteSettings>): Promise<SiteSettings> {
  const stmts: D1PreparedStatement[] = [];
  for (const [key, value] of Object.entries(updates)) {
    stmts.push(
      env.DB.prepare(
        'INSERT INTO settings (key, value, updated_at) VALUES (?, ?, datetime(\'now\')) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at'
      ).bind(key, JSON.stringify(value))
    );
  }
  if (stmts.length > 0) {
    await env.DB.batch(stmts);
  }
  // Invalidate caches
  await env.BLOG_KV.delete('config:settings');
  await env.BLOG_KV.delete('css:main');
  return getSettings(env);
}

export async function getSetting(env: Env, key: string): Promise<any> {
  const settings = await getSettings(env);
  return (settings as any)[key];
}
