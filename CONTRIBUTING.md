# Contributing to ReproProof

Thank you for helping reduce maintainer toil. Contributions must be substantive, tested, and safe for projects that process hostile input.

## Ten-minute setup

1. Install Git, Node.js 22+, and Corepack.
2. Fork and clone the repository.
3. Run `corepack pnpm install`.
4. Run `corepack pnpm check`.
5. Run `corepack pnpm demo` and inspect `.reproproof/demo`.

Python adapter E2E requires Python 3.10+ and pytest. The rest of the workspace remains usable without a cloud API key.

## Where to contribute

Language adapters, test-framework detection, providers, report formats, sandbox backends, operating-system support, fixtures, security tests, performance, translations, and documentation are separate contribution surfaces.

## Workflow

- Open or select an issue with clear acceptance criteria before a large change.
- Create a focused branch and use Conventional Commits.
- Add or update tests. Never skip a failing test to make CI green.
- Run `corepack pnpm check`.
- Explain security/privacy effects in the PR template.

Do not submit generated bulk changes, fabricated benchmark results, cosmetic contribution-graph padding, unsolicited changes to third-party repositories, or reports containing secrets.

## Adding an adapter

Implement `LanguageAdapter`, return an argv array rather than a shell string, keep executable selection allowlisted, and add an intentionally failing fixture plus E2E coverage. Setup commands from issue text are never acceptable.

## Adding a provider

Implement `ReproProvider`, state whether it sends code externally, keep protocol code outside core, resist prompt injection, parse one constrained candidate file, expose usage when the service reports it, and add mock HTTP tests without spending API credits.

## Questions

Use GitHub Discussions after publication for design and setup questions. Use issues for actionable defects. Use private vulnerability reporting for security problems.
