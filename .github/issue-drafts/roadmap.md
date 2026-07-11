## Background

The local v0.1 implementation passes lint, strict type checking, build, and controlled Node/Python tests. External infrastructure paths are implemented but not yet live-validated.

## Scope

- [ ] Build and scan `sandbox/Dockerfile` on Linux and Windows Docker hosts.
- [ ] Run both controlled fixtures using normal `--execute`.
- [ ] Verify CI, CodeQL, dependency review, Pages, and release provenance.
- [ ] Smoke-test OpenAI, Anthropic, and loopback providers with explicit consent and no committed credentials.
- [ ] Test Draft PR creation/rollback in an owned disposable repository with minimal token permissions.
- [ ] Record exact evidence and failures in the benchmark/release checklist.

## Non-goals

No unsolicited third-party issues/PRs, no auto-merge, no fabricated adoption, and no disabling tests to obtain green checks.

## Acceptance criteria

Every checked item links to a workflow run, release artifact, or sanitized test record. Discovered failures become focused issues rather than being omitted.
