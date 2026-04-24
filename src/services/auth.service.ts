// Auth service: login, token management
import type { Env, AdminRow } from '../env';
import { verifyPassword, hashPassword } from '../utils/password';
import { signJwt } from '../utils/jwt';

const ACCESS_TOKEN_EXPIRY = 2 * 60 * 60; // 2 hours
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60; // 7 days

export async function login(
  env: Env,
  username: string,
  password: string
): Promise<{ accessToken: string; refreshToken: string; admin: Omit<AdminRow, 'password_hash'> } | null> {
  const row = await env.DB.prepare('SELECT * FROM admin WHERE username = ?')
    .bind(username)
    .first<AdminRow>();

  if (!row) return null;

  // Handle first-run: if the hash contains placeholder, set the password and skip verify
  let valid: boolean;
  if (row.password_hash.includes('placeholder_hash_replace_on_first_run')) {
    const newHash = await hashPassword(password);
    await env.DB.prepare('UPDATE admin SET password_hash = ?, updated_at = datetime(\'now\') WHERE id = ?')
      .bind(newHash, row.id)
      .run();
    valid = true; // password was just set to what user typed, no need to verify
  } else {
    valid = await verifyPassword(password, row.password_hash);
  }
  if (!valid) return null;

  const accessToken = await signJwt(
    { sub: row.id, username: row.username, type: 'access' },
    env.JWT_SECRET,
    ACCESS_TOKEN_EXPIRY
  );
  const refreshToken = await signJwt(
    { sub: row.id, username: row.username, type: 'refresh' },
    env.JWT_SECRET,
    REFRESH_TOKEN_EXPIRY
  );

  const { password_hash: _, ...admin } = row;
  return { accessToken, refreshToken, admin };
}

export async function refreshAccessToken(
  env: Env,
  adminId: number,
  username: string
): Promise<{ accessToken: string; refreshToken: string }> {
  const accessToken = await signJwt(
    { sub: adminId, username, type: 'access' },
    env.JWT_SECRET,
    ACCESS_TOKEN_EXPIRY
  );
  const refreshToken = await signJwt(
    { sub: adminId, username, type: 'refresh' },
    env.JWT_SECRET,
    REFRESH_TOKEN_EXPIRY
  );
  return { accessToken, refreshToken };
}

export async function getAdmin(env: Env, id: number): Promise<Omit<AdminRow, 'password_hash'> | null> {
  const row = await env.DB.prepare('SELECT * FROM admin WHERE id = ?')
    .bind(id)
    .first<AdminRow>();
  if (!row) return null;
  const { password_hash: _, ...admin } = row;
  return admin;
}

export async function updatePassword(env: Env, id: number, newPassword: string): Promise<void> {
  const hash = await hashPassword(newPassword);
  await env.DB.prepare('UPDATE admin SET password_hash = ?, updated_at = datetime(\'now\') WHERE id = ?')
    .bind(hash, id)
    .run();
}
