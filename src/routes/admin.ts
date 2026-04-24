// Admin panel routes - serves embedded SPA
import { Hono } from 'hono';
import type { Env } from '../env';
import { renderAdminShell } from '../templates/pages/admin';

export const adminRoutes = new Hono<{ Bindings: Env }>();

// Serve admin SPA shell for all /admin/* routes
adminRoutes.get('/', (c) => {
  return c.html(renderAdminShell());
});

adminRoutes.get('/*', (c) => {
  return c.html(renderAdminShell());
});
