import { describe, expect, it } from 'vitest';
import { PythonLanguageAdapter } from '../../packages/language-python/src/index.js';

describe('adapter execution assessment', () => {
  it('does not call missing pytest a reproduction', () => {
    const adapter = new PythonLanguageAdapter();
    const result = adapter.assessExecution({
      command: ['python', '-m', 'pytest'],
      exitCode: 1,
      timedOut: false,
      durationMs: 10,
      stdout: '',
      stderr: 'python: No module named pytest'
    }, 'tests/test_negative.py');
    expect(result.intendedFailure).toBe(false);
  });
});
