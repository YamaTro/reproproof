import type { ExecutionResult, LanguageAdapter, RepositoryProfile } from '@reproproof/core';

export class NodeLanguageAdapter implements LanguageAdapter {
  readonly id = 'node' as const;
  supports(profile: RepositoryProfile): boolean { return profile.languages.includes('node'); }
  testCommand(profile: RepositoryProfile, candidatePath: string): readonly string[] {
    const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    if (profile.testFrameworks.includes('vitest')) return [npm, 'test', '--', 'run', candidatePath];
    if (profile.testFrameworks.includes('jest')) return [npm, 'test', '--', '--runTestsByPath', candidatePath];
    return ['node', '--test', candidatePath];
  }
  assessExecution(result: ExecutionResult, candidatePath: string): { readonly intendedFailure: boolean; readonly reason: string } {
    const output = `${result.stdout}\n${result.stderr}`;
    const mentionsCandidate = output.replaceAll('\\', '/').includes(candidatePath.replaceAll('\\', '/'));
    const assertion = /AssertionError|failing tests:|\bFAIL(?:ED)?\b/i.test(output);
    const intendedFailure = result.exitCode !== 0 && !result.timedOut && mentionsCandidate && assertion;
    return { intendedFailure, reason: intendedFailure ? 'The test runner reported an assertion/test failure tied to the candidate path.' : 'The nonzero exit was not proven to be an assertion/test failure tied to the candidate.' };
  }
}
