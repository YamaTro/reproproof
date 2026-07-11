import type { ParsedIssue } from './types.js';

const headings: Record<string, readonly string[]> = {
  expected: ['expected', 'expected behavior', '期待する動作', '期待動作'],
  actual: ['actual', 'actual behavior', 'observed', '実際の動作', '現象'],
  steps: ['steps to reproduce', 'reproduction', 'repro steps', '再現手順', '手順'],
  environment: ['environment', 'versions', '環境', 'バージョン']
};

const injectionPatterns = [
  /ignore (?:all|any|the|previous) instructions?/i,
  /system (?:message|prompt)/i,
  /developer (?:message|instruction)/i,
  /exfiltrat|upload .*secret|print .*token/i,
  /命令を無視|システムプロンプト|秘密.*送信/i
];

function sectionLines(body: string, wanted: readonly string[]): string[] {
  const lines = body.split(/\r?\n/);
  const output: string[] = [];
  let active = false;
  let inFence = false;
  for (const line of lines) {
    const match = /^#{1,6}\s+(.+?)\s*$/.exec(line);
    if (match) {
      const normalized = (match[1] ?? '').toLowerCase().replace(/[:：]$/, '').trim();
      active = wanted.includes(normalized);
      inFence = false;
      continue;
    }
    if (active) {
      if (line.trimStart().startsWith('```')) {
        inFence = !inFence;
        continue;
      }
      if (inFence) continue;
      const clean = line.replace(/^\s*(?:[-*+] |\d+[.)]\s*)/, '').trim();
      if (clean) output.push(clean);
    }
  }
  return output;
}

export function parseIssue(body: string, title = 'Untitled issue'): ParsedIssue {
  const expected = sectionLines(body, headings.expected ?? []);
  const actual = sectionLines(body, headings.actual ?? []);
  const steps = sectionLines(body, headings.steps ?? []);
  const environment = sectionLines(body, headings.environment ?? []);
  const missing: string[] = [];
  if (expected.length === 0) missing.push('Expected behavior');
  if (actual.length === 0) missing.push('Actual behavior or failure output');
  if (steps.length === 0) missing.push('Steps to reproduce');
  if (environment.length === 0) missing.push('Environment and version information');
  const injectionSignals = body.split(/\r?\n/).filter((line) => injectionPatterns.some((pattern) => pattern.test(line))).map((line) => line.slice(0, 160));
  return {
    title,
    body,
    expected,
    actual,
    steps,
    environment,
    missing,
    assumptions: missing.length === 0 ? [] : ['Static analysis may continue, but execution confidence is reduced until missing information is supplied.'],
    injectionSignals
  };
}
