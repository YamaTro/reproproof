import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import { parseIssue } from '../../packages/core/src/issue-parser.js';
import { MockProvider } from '../../packages/provider-mock/src/index.js';

describe('MockProvider', () => {
  it('extracts a deterministic fixture without external calls', async () => {
    const body = await readFile('fixtures/issues/node-add.md', 'utf8');
    const provider = new MockProvider();
    const result = await provider.generate({
      issue: parseIssue(body),
      repository: { root: 'fixture', languages: ['node'], testFrameworks: ['node-test'], guidanceFiles: [], manifests: ['package.json'] },
      selectedFiles: {}
    });
    expect(provider.sendsCodeExternally).toBe(false);
    expect(result.candidate?.path).toBe('test/negative.test.js');
    expect(result.usage?.estimatedUsd).toBe(0);
  });
});
