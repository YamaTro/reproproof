## Background

ReproProof must distinguish an intended assertion failure from a setup or unrelated failure. A missing-pytest false positive was already found and fixed; broader wrong-reason coverage is needed.

## Implementation scope

Add one controlled Node or Python fixture whose candidate exits nonzero for an unrelated reason (for example, a safe import/collection error), and prove the adapter returns `inconclusive` rather than `reproduced`.

## Likely files

- `fixtures/issues/`
- `fixtures/node-test/` or `fixtures/python-pytest/`
- `tests/e2e/`
- optionally `packages/language-node/src/index.ts` or `packages/language-python/src/index.ts`

## Acceptance criteria

- [ ] Fixture is minimal, original, and Apache-2.0-compatible.
- [ ] The candidate exits nonzero for the documented unrelated reason.
- [ ] ReproProof reports `inconclusive`, with an understandable assessment note.
- [ ] Existing verified reproductions remain `reproduced`.
- [ ] `corepack pnpm check` succeeds.

## Test method

Run the new focused E2E test, then `corepack pnpm check`. Include the relevant sanitized report excerpt in the PR.

## Difficulty

Beginner-to-intermediate. The main challenge is expressing the evidence boundary, not writing a large amount of code.

## Questions

Comment on this issue with the proposed failure mode before implementing so maintainers can confirm it is safe and non-duplicative.
