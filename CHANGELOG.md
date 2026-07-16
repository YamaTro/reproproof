# Changelog

All notable changes follow Keep a Changelog. Versions follow Semantic Versioning.

## [Unreleased]

No unreleased changes.

## [0.1.0] - 2026-07-16

### Added

- Provider-neutral core, CLI, offline mock provider, loopback local provider, OpenAI and Anthropic adapters.
- Node and Python language adapters with node:test, Jest, Vitest, and pytest detection.
- Disposable-copy execution, command allowlist, timeout, secret masking, relative-path and symlink-parent checks.
- Default Docker execution with no network, read-only mounts, dropped capabilities, non-root UID, PID/CPU/memory limits, and bounded tmpfs; unsafe local fixture mode is explicit.
- Opt-in public GitHub issue URL ingestion.
- Double-opt-in Draft PR creation after verified reproduction, with no merge endpoint and branch cleanup on PR failure.
- Markdown/JSON reports and candidate patch generation.
- Controlled Node and Python fixtures with unit, integration, and E2E tests.
- OSS governance, security, research, roadmap, launch, and application-preparation documentation.

### Known limitations

- Docker execution and Draft PR writes are implemented but not yet live-validated against external infrastructure.
- Cloud and loopback provider protocols still require opt-in live validation.
- The controlled fixtures are not a representative benchmark of real-world repositories.
