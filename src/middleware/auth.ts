// JWT authentication middleware for Hono
import { createMiddleware } from 'hono/factory';
import type { Env } from '../env';
import { verifyJwt } from '../utils/jwt';

type AuthEnv = { Bindings: Env; Variables: { adminId: number; username: string } };

export const requireAuth = createMiddleware<AuthEnv>(async (c, next) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Missing or invalid token' } }, 401);
  }

  const token = authHeader.substring(7);
  const payload = await verifyJwt(token, c.env.JWT_SECRET);

  if (!payload || payload.type !== 'access') {
    return c.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid or expired token' } }, 401);
  }

  c.set('adminId', payload.sub);
  c.set('username', payload.username);
  await next();
});

// Optional auth: sets variables if token present, but doesn't block
export const optionalAuth = createMiddleware<AuthEnv>(async (c, next) => {
  const authHeader = c.req.header('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const payload = await verifyJwt(token, c.env.JWT_SECRET);
    if (payload && payload.type === 'access') {
      c.set('adminId', payload.sub);
      c.set('username', payload.username);
    }
  }
  await next();
});
