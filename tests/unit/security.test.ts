import { describe, expect, it } from 'vitest';
import { maskSecrets, safeRelativePath, sanitizedEnvironment } from '../../packages/core/src/security.js';

describe('security boundaries', () => {
  it('rejects path traversal', () => {
    expect(() => safeRelativePath('/tmp/repo', '../secret')).toThrow(/escapes/);
  });

  it('masks common secret formats', () => {
    expect(maskSecrets('token=ghp_123456789012345678901234567890')).not.toContain('ghp_');
    expect(maskSecrets('api_key=top-secret')).toContain('[REDACTED]');
  });

  it('drops credentials from child environments', () => {
    const env = sanitizedEnvironment({ PATH: '/bin', OPENAI_API_KEY: 'secret' });
    expect(env.PATH).toBe('/bin');
    expect(env.OPENAI_API_KEY).toBeUndefined();
  });
});
