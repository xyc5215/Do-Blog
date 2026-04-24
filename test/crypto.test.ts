// Unit tests for password and JWT utilities
import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword } from '../src/utils/password';
import { signJwt, verifyJwt } from '../src/utils/jwt';

// ===================== password.ts =====================
describe('password', () => {
  it('hashPassword returns pbkdf2 formatted string', async () => {
    const hash = await hashPassword('test123');
    expect(hash).toMatch(/^pbkdf2:100000:[a-f0-9]+:[a-f0-9]+$/);
  });

  it('hashPassword generates unique hashes (random salt)', async () => {
    const h1 = await hashPassword('same');
    const h2 = await hashPassword('same');
    expect(h1).not.toBe(h2); // Different salts
  });

  it('verifyPassword returns true for correct password', async () => {
    const hash = await hashPassword('mypassword');
    const valid = await verifyPassword('mypassword', hash);
    expect(valid).toBe(true);
  });

  it('verifyPassword returns false for wrong password', async () => {
    const hash = await hashPassword('correct');
    const valid = await verifyPassword('wrong', hash);
    expect(valid).toBe(false);
  });

  it('verifyPassword returns false for malformed hash', async () => {
    expect(await verifyPassword('test', 'garbage')).toBe(false);
    expect(await verifyPassword('test', 'a:b:c')).toBe(false);
    expect(await verifyPassword('test', 'pbkdf2:abc:xx:yy')).toBe(false);
  });

  it('verifyPassword returns false for wrong prefix', async () => {
    expect(await verifyPassword('test', 'bcrypt:100000:aabb:ccdd')).toBe(false);
  });

  it('handles empty password', async () => {
    const hash = await hashPassword('');
    const valid = await verifyPassword('', hash);
    expect(valid).toBe(true);
  });

  it('handles unicode password', async () => {
    const hash = await hashPassword('密码测试🔑');
    const valid = await verifyPassword('密码测试🔑', hash);
    expect(valid).toBe(true);
  });

  it('handles very long password', async () => {
    const longPw = 'a'.repeat(1000);
    const hash = await hashPassword(longPw);
    const valid = await verifyPassword(longPw, hash);
    expect(valid).toBe(true);
  });
});

// ===================== jwt.ts =====================
describe('jwt', () => {
  const secret = 'test-secret-key-for-jwt';

  it('signJwt returns a 3-part token', async () => {
    const token = await signJwt({ sub: 1, username: 'admin', type: 'access' }, secret, 3600);
    const parts = token.split('.');
    expect(parts.length).toBe(3);
  });

  it('verifyJwt returns payload for valid token', async () => {
    const token = await signJwt({ sub: 42, username: 'user', type: 'access' }, secret, 3600);
    const payload = await verifyJwt(token, secret);
    expect(payload).not.toBeNull();
    expect(payload!.sub).toBe(42);
    expect(payload!.username).toBe('user');
    expect(payload!.type).toBe('access');
  });

  it('verifyJwt returns null for wrong secret', async () => {
    const token = await signJwt({ sub: 1, username: 'admin', type: 'access' }, secret, 3600);
    const payload = await verifyJwt(token, 'wrong-secret');
    expect(payload).toBeNull();
  });

  it('verifyJwt returns null for expired token', async () => {
    const token = await signJwt({ sub: 1, username: 'admin', type: 'access' }, secret, -1);
    const payload = await verifyJwt(token, secret);
    expect(payload).toBeNull();
  });

  it('verifyJwt returns null for malformed token', async () => {
    expect(await verifyJwt('not.a.token', secret)).toBeNull();
    expect(await verifyJwt('abc', secret)).toBeNull();
    expect(await verifyJwt('', secret)).toBeNull();
    expect(await verifyJwt('a.b', secret)).toBeNull();
  });

  it('verifyJwt returns null for tampered payload', async () => {
    const token = await signJwt({ sub: 1, username: 'admin', type: 'access' }, secret, 3600);
    const parts = token.split('.');
    // Tamper with the payload
    const tamperedPayload = btoa(JSON.stringify({ sub: 999, username: 'hacker', type: 'access', iat: 0, exp: 9999999999 }))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    const tampered = parts[0] + '.' + tamperedPayload + '.' + parts[2];
    const payload = await verifyJwt(tampered, secret);
    expect(payload).toBeNull();
  });

  it('access and refresh tokens have different types', async () => {
    const access = await signJwt({ sub: 1, username: 'admin', type: 'access' }, secret, 3600);
    const refresh = await signJwt({ sub: 1, username: 'admin', type: 'refresh' }, secret, 604800);
    const ap = await verifyJwt(access, secret);
    const rp = await verifyJwt(refresh, secret);
    expect(ap!.type).toBe('access');
    expect(rp!.type).toBe('refresh');
  });

  it('payload contains iat and exp', async () => {
    const token = await signJwt({ sub: 1, username: 'admin', type: 'access' }, secret, 7200);
    const payload = await verifyJwt(token, secret);
    expect(payload!.iat).toBeDefined();
    expect(payload!.exp).toBeDefined();
    expect(payload!.exp - payload!.iat).toBe(7200);
  });
});
