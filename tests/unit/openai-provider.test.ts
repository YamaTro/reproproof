import { describe, expect, it } from 'vitest';
import { extractOpenAIText } from '../../packages/provider-openai/src/index.js';

describe('OpenAI raw Responses parsing', () => {
  it('extracts output_text parts from the documented raw output array', () => {
    expect(extractOpenAIText({
      output: [{ type: 'message', content: [{ type: 'output_text', text: '{"candidate":null,"notes":[]}' }] }]
    })).toBe('{"candidate":null,"notes":[]}');
  });

  it('does not depend on the SDK-only top-level output_text convenience field', () => {
    expect(extractOpenAIText({ output: [] })).toBe('');
  });
});
