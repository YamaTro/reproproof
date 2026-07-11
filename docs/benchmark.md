# Controlled-fixture benchmark

Measured locally on 2026-07-11 (JST). This is an engineering smoke benchmark, **not** evidence of performance on real OSS issues.

## Method

- ReproProof commit: working tree before first public commit.
- Host: Windows, Node.js 24.13.1, Python 3.13, pytest 8.4.1.
- Provider: deterministic mock; no API/network call.
- Fixtures: one intentionally buggy JavaScript project using `node:test`; one intentionally buggy Python project using pytest.
- Success definition: a candidate file is generated and the adapter identifies an assertion/test failure tied to that candidate on the buggy base.
- False-reproduction check: one simulated missing-pytest process result must be classified as inconclusive, not reproduced.

## Results

| Metric | Result | Evidence/limitation |
|---|---:|---|
| Candidate generation success | 2/2 (100%) | Deterministic candidates embedded in fixture issues; does not measure LLM generation |
| Intended base-branch failure | 2/2 (100%) | Node assertion and pytest assertion recognized |
| Known infrastructure false positive | 0/1 | Missing pytest was correctly classified inconclusive after a discovered/fixed bug |
| Wrong-reason reproduction rate | Not measurable | Two controlled cases are insufficient; no real-issue oracle set |
| Node candidate execution | 256 ms | One CLI demo run; excludes build/install time |
| Python candidate execution | 2,978 ms | One CLI demo run after pinned pytest install; excludes build/install time |
| API usage | 0 input / 0 output tokens | Mock provider only |
| Estimated API cost | $0.00 | Mock provider only |

## Failures and constraints observed

1. Vitest originally discovered the fixture's own `node:test` file; test discovery was constrained to `tests/`.
2. The demo script initially passed an extra literal `--` through pnpm; it was changed to invoke the built CLI directly.
3. The first Python run lacked pytest inside the sanitized environment and was incorrectly labeled reproduced because the pipeline treated any nonzero exit as success. Adapter-specific evidence assessment now classifies setup/runner errors as inconclusive. A regression test covers the missing-pytest case.
4. Python per-user packages on Windows require `APPDATA`; the sanitized environment allows that path variable but still excludes provider and GitHub credentials.
5. Local execution has no kernel-level network/CPU/memory/disk limits.

## Next benchmark

Use a legally redistributable subset of public bug-reproduction benchmarks with frozen commits and license metadata. Report generation rate, compile/collection failures, correct fail-to-pass behavior against known fixes, wrong-reason failures, wall time, tokens, provider price at measurement time, and unsupported reasons. Never collapse “candidate generated” into “correct reproduction.”
