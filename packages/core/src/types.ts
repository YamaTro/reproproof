export type Confidence = 'low' | 'medium' | 'high';
export type ReproductionStatus = 'analysis-only' | 'reproduced' | 'not-reproduced' | 'inconclusive' | 'error';

export interface ParsedIssue {
  readonly title: string;
  readonly body: string;
  readonly expected: readonly string[];
  readonly actual: readonly string[];
  readonly steps: readonly string[];
  readonly environment: readonly string[];
  readonly missing: readonly string[];
  readonly assumptions: readonly string[];
  readonly injectionSignals: readonly string[];
}

export interface RepositoryProfile {
  readonly root: string;
  readonly languages: readonly ('node' | 'python')[];
  readonly testFrameworks: readonly ('jest' | 'vitest' | 'node-test' | 'pytest')[];
  readonly guidanceFiles: readonly string[];
  readonly manifests: readonly string[];
}

export interface CandidateFile {
  readonly path: string;
  readonly content: string;
  readonly rationale: string;
}

export interface ProviderContext {
  readonly issue: ParsedIssue;
  readonly repository: RepositoryProfile;
  readonly selectedFiles: Readonly<Record<string, string>>;
}

export interface UsageRecord {
  readonly inputTokens?: number | undefined;
  readonly outputTokens?: number | undefined;
  readonly estimatedUsd?: number | undefined;
}

export interface ProviderResult {
  readonly candidate: CandidateFile | null;
  readonly notes: readonly string[];
  readonly usage?: UsageRecord;
}

export interface ReproProvider {
  readonly id: string;
  readonly sendsCodeExternally: boolean;
  generate(context: ProviderContext): Promise<ProviderResult>;
}

export interface LanguageAdapter {
  readonly id: 'node' | 'python';
  supports(profile: RepositoryProfile): boolean;
  testCommand(profile: RepositoryProfile, candidatePath: string): readonly string[];
  assessExecution(result: ExecutionResult, candidatePath: string): { readonly intendedFailure: boolean; readonly reason: string };
}

export interface ExecutionResult {
  readonly command: readonly string[];
  readonly exitCode: number | null;
  readonly timedOut: boolean;
  readonly durationMs: number;
  readonly stdout: string;
  readonly stderr: string;
}

export interface ReproReport {
  readonly schemaVersion: '1.0';
  readonly generatedAt: string;
  readonly status: ReproductionStatus;
  readonly confidence: Confidence;
  readonly issue: ParsedIssue;
  readonly repository: Omit<RepositoryProfile, 'root'>;
  readonly provider: string;
  readonly candidate: CandidateFile | null;
  readonly execution: ExecutionResult | null;
  readonly notes: readonly string[];
  readonly usage: UsageRecord | null;
}

export interface RunOptions {
  readonly repoPath: string;
  readonly issueMarkdown: string;
  readonly issueTitle?: string;
  readonly provider: ReproProvider;
  readonly adapters: readonly LanguageAdapter[];
  readonly execute: boolean;
  readonly executionMode?: 'docker' | 'local';
  readonly sandboxImage?: string;
  readonly outputDir: string;
  readonly timeoutMs?: number;
}

export interface RunArtifacts {
  readonly report: ReproReport;
  readonly jsonPath: string;
  readonly markdownPath: string;
  readonly patchPath: string | null;
}
