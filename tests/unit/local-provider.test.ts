import { afterEach, describe, expect, it, vi } from 'vitest';
import { LocalProvider } from '../../packages/provider-local/src/index.js';

afterEach(() => vi.unstubAllGlobals());

describe('LocalProvider', () => {
  it('keeps the /v1 prefix and only calls loopback', async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({
      choices: [{ message: { content: '<reproproof-file path="test/repro.js">\ntest()\n</reproproof-file>' } }]
    }), { status: 200, headers: { 'content-type': 'application/json' } }));
    vi.stubGlobal('fetch', fetchMock);
    const provider = new LocalProvider('http://127.0.0.1:11434/v1', 'local-model');
    await provider.generate({
      issue: { title: 'x', body: 'x', expected: [], actual: [], steps: [], environment: [], missing: [], assumptions: [], injectionSignals: [] },
      repository: { root: '.', languages: ['node'], testFrameworks: ['node-test'], guidanceFiles: [], manifests: [] },
      selectedFiles: {}
    });
    expect(String(fetchMock.mock.calls[0]?.[0])).toBe('http://127.0.0.1:11434/v1/chat/completions');
  });

  it('rejects non-loopback endpoints', () => {
    expect(() => new LocalProvider('https://example.com/v1', 'model')).toThrow(/loopback/);
  });
});
