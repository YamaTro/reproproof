import type { ProviderContext, ProviderResult, ReproProvider } from '@reproproof/core';

function block(body: string, language: string): string | null {
  const expression = new RegExp('```' + language + '\\s+reproproof:path=([^\\s]+)\\r?\\n([\\s\\S]*?)\\r?\\n```', 'i');
  const match = expression.exec(body);
  return match ? `${match[1]}\0${match[2]}` : null;
}

export class MockProvider implements ReproProvider {
  readonly id = 'mock';
  readonly sendsCodeExternally = false;

  async generate(context: ProviderContext): Promise<ProviderResult> {
    const node = block(context.issue.body, '(?:ts|typescript|js|javascript)');
    const python = block(context.issue.body, 'python');
    const encoded = node ?? python;
    if (!encoded) {
      return {
        candidate: null,
        notes: ['Mock provider requires a fenced fixture block with `reproproof:path=<relative-path>`. No model or external service was called.'],
        usage: { inputTokens: 0, outputTokens: 0, estimatedUsd: 0 }
      };
    }
    const separator = encoded.indexOf('\0');
    return {
      candidate: {
        path: encoded.slice(0, separator),
        content: `${encoded.slice(separator + 1).trimEnd()}\n`,
        rationale: 'Deterministic fixture supplied to the offline mock provider.'
      },
      notes: ['Candidate generated deterministically by the mock provider; issue prose was never executed as a command.'],
      usage: { inputTokens: 0, outputTokens: 0, estimatedUsd: 0 }
    };
  }
}
