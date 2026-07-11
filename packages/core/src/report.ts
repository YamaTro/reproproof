import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { ReproReport } from './types.js';

function list(items: readonly string[], empty = 'None observed'): string {
  return items.length > 0 ? items.map((item) => `- ${item}`).join('\n') : `- ${empty}`;
}

export function reportMarkdown(report: ReproReport): string {
  const execution = report.execution
    ? `Command: \`${report.execution.command.join(' ')}\`\n\nExit code: ${report.execution.exitCode ?? 'none'}\n\nTimed out: ${report.execution.timedOut}\n\nDuration: ${report.execution.durationMs} ms\n\n\`\`\`text\n${(report.execution.stderr || report.execution.stdout).slice(0, 20_000)}\n\`\`\``
    : 'Not executed.';
  return `# ReproProof report\n\n- Status: **${report.status}**\n- Confidence: **${report.confidence}**\n- Provider: \`${report.provider}\`\n- Generated: ${report.generatedAt}\n\n## Issue\n\n### Expected\n\n${list(report.issue.expected, 'Not provided')}\n\n### Actual\n\n${list(report.issue.actual, 'Not provided')}\n\n### Reproduction steps\n\n${list(report.issue.steps, 'Not provided')}\n\n### Missing information\n\n${list(report.issue.missing)}\n\n### Untrusted-instruction signals\n\n${list(report.issue.injectionSignals)}\n\n## Repository\n\n- Languages: ${report.repository.languages.join(', ') || 'unknown'}\n- Test frameworks: ${report.repository.testFrameworks.join(', ') || 'unknown'}\n\n## Candidate\n\n${report.candidate ? `\`${report.candidate.path}\` — ${report.candidate.rationale}` : 'No candidate generated.'}\n\n## Execution evidence\n\n${execution}\n\n## Notes\n\n${list(report.notes)}\n`;
}

export async function writeReports(report: ReproReport, outputDir: string): Promise<{ jsonPath: string; markdownPath: string }> {
  await mkdir(outputDir, { recursive: true });
  const jsonPath = join(outputDir, 'report.json');
  const markdownPath = join(outputDir, 'report.md');
  await Promise.all([
    writeFile(jsonPath, `${JSON.stringify(report, null, 2)}\n`, { encoding: 'utf8', mode: 0o600 }),
    writeFile(markdownPath, reportMarkdown(report), { encoding: 'utf8', mode: 0o600 })
  ]);
  return { jsonPath, markdownPath };
}
