# Product decision

Decision date: 2026-07-11. Scores are comparative judgments from 1 (weak) to 5 (strong), not measured market facts.

## Candidates

| Criterion | ReproProof: issue-to-reproduction verifier | Dependency-upgrade evidence bot | Release-notes and migration verifier |
|---|---:|---:|---:|
| Problem severity | 5 | 4 | 3 |
| Plausible user breadth | 4 | 5 | 3 |
| Differentiation | 4 | 2 | 3 |
| Solo maintainability | 3 | 4 | 4 |
| Contributor-friendly modules | 5 | 4 | 3 |
| Downstream dependency potential | 4 | 3 | 2 |
| Security risk (5 = lower) | 2 | 3 | 4 |
| MVP feasibility | 3 | 5 | 4 |
| Reason for repeated use | 5 | 4 | 3 |
| Total | **35** | 34 | 29 |

## Decision

Build **ReproProof**, an evidence-first issue-to-reproduction CLI and GitHub Action.

The margin over dependency upgrades is deliberately small. Upgrade automation is easier to ship, but Dependabot, Renovate, and platform-native tooling already cover much of that workflow. Issue reproduction is harder and riskier, yet the maintained research and tooling landscape shows an unresolved gap between free-form bug reports and verified failing tests.

## Positioning

ReproProof does not promise autonomous bug fixing. It produces:

1. a structured reading of expected/actual behavior, steps, environment, missing details, and assumptions;
2. a reviewable candidate test patch;
3. execution evidence from an isolated copy;
4. an explicit status and confidence level; and
5. Markdown and JSON artifacts usable by humans and later automation.

## Differentiation

- Versus GitHub Copilot cloud agent, Codex, Claude, OpenHands, and SWE-agent: ReproProof stops at evidence and a failing-test candidate instead of optimizing for a fix PR.
- Versus research prototypes such as LIBRO, Issue2Test, and Echo: ReproProof targets an installable provider-neutral maintenance workflow with offline mock mode, local providers, structured reports, and explicit security controls. This is a product goal, not a claim that it outperforms those systems.
- Versus issue templates: templates improve input quality but do not construct or execute a reproduction.

## MVP boundary

The v0.1 line supports local Markdown or opt-in public GitHub issue URLs, local repositories, Node and Python adapters, node:test/Jest/Vitest/pytest command selection, mock/OpenAI/Anthropic/loopback providers, locked-down Docker execution, an explicitly unsafe local fixture mode, reports/patches, and double-opt-in Draft PR creation with no merge path. Docker and GitHub writes are implemented but await live infrastructure validation; production-grade benchmark performance remains future work.

## Falsification criteria

Reconsider or narrow the project if, after ten substantive maintainer interviews and three opt-in pilots, maintainers consistently report that setup/review costs exceed saved triage time, or if wrong-reason reproductions cannot be kept acceptably low with transparent evidence.
