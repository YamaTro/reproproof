import type { ExecutionResult, LanguageAdapter, RepositoryProfile } from '@reproproof/core';

export class PythonLanguageAdapter implements LanguageAdapter {
  readonly id = 'python' as const;
  supports(profile: RepositoryProfile): boolean { return profile.languages.includes('python'); }
  testCommand(_profile: RepositoryProfile, candidatePath: string): readonly string[] {
    return ['python', '-m', 'pytest', '-q', '-p', 'no:cacheprovider', candidatePath];
  }
  assessExecution(result: ExecutionResult, candidatePath: string): { readonly intendedFailure: boolean; readonly reason: string } {
    const output = `${result.stdout}\n${result.stderr}`;
    const normalized = output.replaceAll('\\', '/');
    const candidateStem = candidatePath.replaceAll('\\', '/').split('/').pop()?.replace(/\.py$/, '') ?? candidatePath;
    const mentionsCandidate = normalized.includes(candidatePath.replaceAll('\\', '/')) || normalized.includes(candidateStem);
    const assertion = /AssertionError|\bFAILED\b|E\s+assert\s/i.test(output);
    const infrastructureFailure = /No module named pytest|command not found|not recognized|ImportError during collection/i.test(output);
    const intendedFailure = result.exitCode !== 0 && !result.timedOut && mentionsCandidate && assertion && !infrastructureFailure;
    return { intendedFailure, reason: intendedFailure ? 'pytest reported an assertion failure tied to the candidate.' : 'The nonzero exit appears to be setup, collection, or runner failure rather than a verified candidate assertion.' };
  }
}
