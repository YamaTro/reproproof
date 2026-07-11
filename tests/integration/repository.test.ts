import { describe, expect, it } from 'vitest';
import { analyzeRepository } from '../../packages/core/src/repository.js';

describe('repository analysis', () => {
  it('detects Node test repositories', async () => {
    const profile = await analyzeRepository('fixtures/node-test');
    expect(profile.languages).toContain('node');
    expect(profile.testFrameworks).toContain('node-test');
  });

  it('detects Python pytest repositories', async () => {
    const profile = await analyzeRepository('fixtures/python-pytest');
    expect(profile.languages).toContain('python');
    expect(profile.testFrameworks).toContain('pytest');
  });
});
