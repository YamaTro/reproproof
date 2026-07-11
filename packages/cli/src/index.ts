#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { createDraftPullRequest, fetchGitHubIssue, runReproduction, type ReproProvider } from '@reproproof/core';
import { NodeLanguageAdapter } from '@reproproof/language-node';
import { PythonLanguageAdapter } from '@reproproof/language-python';
import { AnthropicProvider } from '@reproproof/provider-anthropic';
import { LocalProvider } from '@reproproof/provider-local';
import { MockProvider } from '@reproproof/provider-mock';
import { OpenAIProvider } from '@reproproof/provider-openai';

function usage(): string {
  return `ReproProof 0.1.0\n\nUsage:\n  reproproof --repo <path> (--issue <markdown> | --issue-url <url>) [--provider mock] [--execute]\n\nOptions:\n  --repo                 Local repository to analyze\n  --issue                Local Markdown issue file\n  --issue-url            Public github.com issue URL\n  --allow-network        Required to fetch --issue-url\n  --provider             mock | local | openai | anthropic (default: mock)\n  --execute              Run in the locked-down Docker sandbox\n  --unsafe-local-execute Run in a disposable copy without network/resource isolation\n  --sandbox-image        Prebuilt sandbox image (default: reproproof-sandbox:0.1.0)\n  --draft-pr             Create a Draft PR after a verified reproduction\n  --confirm-github-write Second required consent for --draft-pr\n  --output               Artifact directory (default: .reproproof/latest)\n  --allow-external       Required before source is sent to a cloud provider\n  --model                Provider model override\n  --local-base-url       Loopback OpenAI-compatible URL\n  --help                 Show this help\n`;
}

function providerFor(name: string, values: Record<string, string | boolean | undefined>): ReproProvider {
  if (name === 'mock') return new MockProvider();
  if (name === 'local') return new LocalProvider(String(values['local-base-url'] ?? 'http://127.0.0.1:11434/v1'), String(values.model ?? 'qwen2.5-coder'));
  if (!values['allow-external']) throw new Error('Cloud providers require --allow-external because repository data will leave this machine.');
  if (name === 'openai') {
    const key = process.env.OPENAI_API_KEY;
    if (!key) throw new Error('OPENAI_API_KEY is required for the OpenAI provider.');
    return new OpenAIProvider(key, values.model ? String(values.model) : undefined);
  }
  if (name === 'anthropic') {
    const key = process.env.ANTHROPIC_API_KEY;
    if (!key) throw new Error('ANTHROPIC_API_KEY is required for the Anthropic provider.');
    return new AnthropicProvider(key, values.model ? String(values.model) : undefined);
  }
  throw new Error(`Unknown provider: ${name}`);
}

async function main(): Promise<void> {
  const parsed = parseArgs({
    options: {
      repo: { type: 'string' },
      issue: { type: 'string' },
      'issue-url': { type: 'string' },
      'allow-network': { type: 'boolean', default: false },
      provider: { type: 'string', default: 'mock' },
      execute: { type: 'boolean', default: false },
      'unsafe-local-execute': { type: 'boolean', default: false },
      'sandbox-image': { type: 'string', default: 'reproproof-sandbox:0.1.0' },
      'draft-pr': { type: 'boolean', default: false },
      'confirm-github-write': { type: 'boolean', default: false },
      output: { type: 'string', default: '.reproproof/latest' },
      'allow-external': { type: 'boolean', default: false },
      model: { type: 'string' },
      'local-base-url': { type: 'string' },
      help: { type: 'boolean', default: false }
    },
    strict: true
  });
  if (parsed.values.help) { process.stdout.write(usage()); return; }
  if (!parsed.values.repo || Boolean(parsed.values.issue) === Boolean(parsed.values['issue-url'])) throw new Error(`--repo and exactly one of --issue or --issue-url are required.\n\n${usage()}`);
  if (parsed.values.execute && parsed.values['unsafe-local-execute']) throw new Error('Choose either --execute or --unsafe-local-execute, not both.');
  let issueTitle: string | undefined;
  let issueMarkdown: string;
  if (parsed.values.issue) {
    issueMarkdown = await readFile(resolve(parsed.values.issue), 'utf8');
  } else {
    if (!parsed.values['allow-network']) throw new Error('--issue-url requires --allow-network.');
    const issue = await fetchGitHubIssue(String(parsed.values['issue-url']), process.env.GITHUB_TOKEN);
    issueMarkdown = issue.body;
    issueTitle = issue.title;
  }
  const provider = providerFor(parsed.values.provider ?? 'mock', parsed.values);
  const artifacts = await runReproduction({
    repoPath: resolve(parsed.values.repo),
    issueMarkdown,
    ...(issueTitle ? { issueTitle } : {}),
    provider,
    adapters: [new NodeLanguageAdapter(), new PythonLanguageAdapter()],
    execute: Boolean(parsed.values.execute || parsed.values['unsafe-local-execute']),
    executionMode: parsed.values['unsafe-local-execute'] ? 'local' : 'docker',
    sandboxImage: parsed.values['sandbox-image'] ?? 'reproproof-sandbox:0.1.0',
    outputDir: resolve(parsed.values.output ?? '.reproproof/latest')
  });
  let draftPullRequest: string | null = null;
  if (parsed.values['draft-pr']) {
    if (!parsed.values['confirm-github-write']) throw new Error('--draft-pr also requires --confirm-github-write.');
    if (!parsed.values['issue-url']) throw new Error('--draft-pr requires --issue-url so the target repository is explicit.');
    if (!process.env.GITHUB_TOKEN) throw new Error('GITHUB_TOKEN is required for --draft-pr.');
    if (artifacts.report.status !== 'reproduced' || !artifacts.report.candidate) throw new Error('Draft PR creation requires a verified reproduction candidate.');
    const pull = await createDraftPullRequest({
      issueUrl: parsed.values['issue-url'],
      token: process.env.GITHUB_TOKEN,
      candidatePath: artifacts.report.candidate.path,
      candidateContent: artifacts.report.candidate.content,
      reportSummary: `Status: ${artifacts.report.status}; confidence: ${artifacts.report.confidence}. The full report was generated locally and is not uploaded automatically.`
    });
    draftPullRequest = pull.url;
  }
  process.stdout.write(`${JSON.stringify({ status: artifacts.report.status, confidence: artifacts.report.confidence, report: artifacts.markdownPath, patch: artifacts.patchPath, draftPullRequest }, null, 2)}\n`);
  process.exitCode = artifacts.report.status === 'error' ? 2 : 0;
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`ReproProof failed safely: ${message}\n`);
  process.exitCode = 2;
});
