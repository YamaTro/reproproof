import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { runReproduction } from '../../packages/core/src/pipeline.js';
import { NodeLanguageAdapter } from '../../packages/language-node/src/index.js';
import { MockProvider } from '../../packages/provider-mock/src/index.js';

const cleanup: string[] = [];
afterEach(async () => { await Promise.all(cleanup.splice(0).map((path) => rm(path, { recursive: true, force: true }))); });

describe('Node end-to-end reproduction', () => {
  it('generates and verifies an intentionally failing test', async () => {
    const output = await mkdtemp(join(tmpdir(), 'reproproof-e2e-'));
    cleanup.push(output);
    const issueMarkdown = await readFile('fixtures/issues/node-add.md', 'utf8');
    const result = await runReproduction({
      repoPath: 'fixtures/node-test',
      issueMarkdown,
      provider: new MockProvider(),
      adapters: [new NodeLanguageAdapter()],
      execute: true,
      executionMode: 'local',
      outputDir: output,
      timeoutMs: 20_000
    });
    expect(result.report.status).toBe('reproduced');
    expect(result.report.execution?.exitCode).not.toBe(0);
    expect(result.report.notes.at(-1)).toMatch(/assertion\/test failure/);
    expect(await readFile(result.patchPath ?? '', 'utf8')).toContain('negative.test.js');
  });
});
