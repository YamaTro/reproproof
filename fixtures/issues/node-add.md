# `add` returns the wrong result for negative values

## Expected behavior

- `add(-1, 1)` returns `0`.

## Actual behavior

- `add(-1, 1)` returns `2`.

## Steps to reproduce

1. Import `add` from `src/calculator.js`.
2. Call `add(-1, 1)`.
3. Observe `2` instead of `0`.

## Environment

- Node.js 24
- Windows or Linux

```javascript reproproof:path=test/negative.test.js
import assert from 'node:assert/strict';
import test from 'node:test';
import { add } from '../src/calculator.js';

test('preserves negative operands', () => {
  assert.equal(add(-1, 1), 0);
});
```
