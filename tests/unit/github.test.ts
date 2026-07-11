import { describe, expect, it } from 'vitest';
import { parseGitHubIssueUrl } from '../../packages/core/src/github.js';

describe('GitHub issue URL validation', () => {
  it('accepts a canonical public issue URL', () => {
    expect(parseGitHubIssueUrl('https://github.com/owner/repo/issues/42')).toMatchObject({ owner: 'owner', repository: 'repo', number: 42 });
  });
  it('rejects hosts and pull request paths outside the supported boundary', () => {
    expect(() => parseGitHubIssueUrl('https://example.com/a/b/issues/1')).toThrow();
    expect(() => parseGitHubIssueUrl('https://github.com/a/b/pull/1')).toThrow();
  });
});
