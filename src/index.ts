import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { Env } from './env';
import { publicRoutes } from './routes/public';
import { apiRoutes } from './routes/api';
import { adminRoutes } from './routes/admin';

const app = new Hono<{ Bindings: Env }>();

// CORS for API routes
app.use('/api/*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// Security headers
app.use('*', async (c, next) => {
  await next();
  c.header('X-Content-Type-Options', 'nosniff');
  c.header('X-Frame-Options', 'DENY');
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin');
});

// Mount route groups
app.route('/api', apiRoutes);
app.route('/admin', adminRoutes);
app.route('/', publicRoutes);

// Scheduled event handler (cron) for flushing read counts
export default {
  fetch: app.fetch,
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    // Flush read counts from KV to D1
    const keys = await env.BLOG_KV.list({ prefix: 'counter:article:' });
    for (const key of keys.keys) {
      const countStr = await env.BLOG_KV.get(key.name);
      if (!countStr) continue;
      const count = parseInt(countStr, 10);
      if (isNaN(count) || count <= 0) continue;
      const articleId = key.name.replace('counter:article:', '');
      await env.DB.prepare(
        'UPDATE articles SET read_count = read_count + ? WHERE id = ?'
      ).bind(count, parseInt(articleId, 10)).run();
      await env.BLOG_KV.delete(key.name);
    }
  },
};
