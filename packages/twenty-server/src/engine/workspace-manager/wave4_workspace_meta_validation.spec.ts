import { describe, it, expect } from '@jest/globals';

describe('Wave 4: Workspace Metadata and Domain Sanitization Invariants', () => {
  const sanitizeWorkspaceSlug = (name: string): string => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  it('should sanitize workspace subdomain slugs deterministically', () => {
    expect(sanitizeWorkspaceSlug('Acme Corp HQ!')).toBe('acme-corp-hq');
    expect(sanitizeWorkspaceSlug('  Engineering & Design  ')).toBe('engineering-design');
    expect(sanitizeWorkspaceSlug('---alpha---beta---')).toBe('alpha-beta');
  });

  it('should validate workspace invite token expiration windows', () => {
    const isTokenValid = (createdAt: number, ttlSeconds: number, now: number): boolean => {
      return (now - createdAt) <= (ttlSeconds * 1000);
    };

    const now = 1788500000000;
    const ttl = 86400; // 24 hours
    expect(isTokenValid(now - 3600000, ttl, now)).toBe(true);
    expect(isTokenValid(now - 90000000, ttl, now)).toBe(false);
  });
});
