import { cp, mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, relative } from 'node:path';
import { executeAllowed, executeDocker } from './executor.js';
import { parseIssue } from './issue-parser.js';
import { writeReports } from './report.js';
import { analyzeRepository, readRepositoryContext } from './repository.js';
import { assertNoSymlinkParents, safeRelativePath } from './security.js';
import type { ReproReport, RunArtifacts, RunOptions } from './types.js';

function unifiedNewFile(path: string, content: string): string {
  const lines = content.replace(/\n$/, '').split('\n');
  return `diff --git a/${path} b/${path}\nnew file mode 100644\n--- /dev/null\n+++ b/${path}\n@@ -0,0 +1,${lines.length} @@\n${lines.map((line) => `+${line}`).join('\n')}\n`;
}

export async function runReproduction(options: RunOptions): Promise<RunArtifacts> {
  const issue = parseIssue(options.issueMarkdown, options.issueTitle);
  const repository = await analyzeRepository(options.repoPath);
  const selectedFiles = await readRepositoryContext(repository);
  const generated = await options.provider.generate({ issue, repository, selectedFiles });
  let execution = null;
  let assessment: { readonly intendedFailure: boolean; readonly reason: string } | null = null;
  let patchPath: string | null = null;
  let workspace: string | null = null;
  try {
    if (generated.candidate) {
      safeRelativePath(options.repoPath, generated.candidate.path);
      const patch = unifiedNewFile(generated.candidate.path, generated.candidate.content);
      await mkdir(options.outputDir, { recursive: true });
      patchPath = join(options.outputDir, 'candidate.patch');
      await writeFile(patchPath, patch, { encoding: 'utf8', mode: 0o600 });
      if (options.execute) {
        workspace = await mkdtemp(join(tmpdir(), 'reproproof-'));
        await cp(options.repoPath, workspace, {
          recursive: true,
          dereference: false,
          filter: (source) => !['.git', 'node_modules', '.venv', 'dist'].includes(relative(options.repoPath, source).split(/[\\/]/)[0] ?? '')
        });
        const target = safeRelativePath(workspace, generated.candidate.path);
        await assertNoSymlinkParents(workspace, generated.candidate.path);
        await mkdir(dirname(target), { recursive: true });
        await writeFile(target, generated.candidate.content, { encoding: 'utf8', mode: 0o600 });
        const adapter = options.adapters.find((item) => item.supports(repository));
        if (!adapter) throw new Error('No language adapter supports this repository.');
        const testCommand = adapter.testCommand(repository, generated.candidate.path);
        execution = options.executionMode === 'local'
          ? await executeAllowed(testCommand, workspace, options.timeoutMs)
          : await executeDocker(testCommand, workspace, options.sandboxImage ?? 'reproproof-sandbox:0.1.0', options.timeoutMs);
        assessment = adapter.assessExecution(execution, generated.candidate.path);
      }
    }
  } finally {
    if (workspace) await rm(workspace, { recursive: true, force: true, maxRetries: 3 });
  }
  const status = !generated.candidate ? 'inconclusive' : !options.execute ? 'analysis-only' : execution?.timedOut ? 'inconclusive' : execution?.exitCode === 0 ? 'not-reproduced' : assessment?.intendedFailure ? 'reproduced' : 'inconclusive';
  const confidence = status === 'reproduced' && issue.missing.length === 0 ? 'high' : status === 'reproduced' ? 'medium' : 'low';
  const report: ReproReport = {
    schemaVersion: '1.0',
    generatedAt: new Date().toISOString(),
    status,
    confidence,
    issue,
    repository: {
      languages: repository.languages,
      testFrameworks: repository.testFrameworks,
      guidanceFiles: repository.guidanceFiles,
      manifests: repository.manifests
    },
    provider: options.provider.id,
    candidate: generated.candidate,
    execution,
    notes: assessment ? [...generated.notes, assessment.reason] : generated.notes,
    usage: generated.usage ?? null
  };
  const paths = await writeReports(report, options.outputDir);
  return { report, ...paths, patchPath };
}
