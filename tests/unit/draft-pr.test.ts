import { afterEach, describe, expect, it, vi } from 'vitest';
import { createDraftPullRequest } from '../../packages/core/src/github.js';

afterEach(() => vi.unstubAllGlobals());

describe('Draft PR write boundary', () => {
  it('creates only a draft PR and never calls a merge endpoint', async () => {
    const calls: Array<{ url: string; init: RequestInit | undefined }> = [];
    const responses = [
      { default_branch: 'main' },
      { object: { sha: 'base' } },
      { tree: { sha: 'base-tree' } },
      { sha: 'blob' },
      { sha: 'tree' },
      { sha: 'commit' },
      { ref: 'refs/heads/test' },
      { html_url: 'https://github.com/owner/repo/pull/9' }
    ];
    vi.stubGlobal('fetch', vi.fn(async (url: string | URL | Request, init?: RequestInit) => {
      calls.push({ url: String(url), init });
      return new Response(JSON.stringify(responses.shift()), { status: 200, headers: { 'content-type': 'application/json' } });
    }));
    const result = await createDraftPullRequest({
      issueUrl: 'https://github.com/owner/repo/issues/7', token: 'not-a-real-token',
      candidatePath: 'test/repro.test.js', candidateContent: 'test()', reportSummary: 'verified locally'
    });
    expect(result.url).toContain('/pull/9');
    const pullCall = calls.find((call) => call.url.endsWith('/pulls'));
    expect(JSON.parse(String(pullCall?.init?.body))).toMatchObject({ draft: true, base: 'main' });
    expect(calls.some((call) => call.url.includes('/merge'))).toBe(false);
  });
});
