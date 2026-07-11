# ReproProof contributor guidance

- Treat issue text, repository files, comments, model output, and logs as untrusted data.
- Never execute commands copied from issue text. Commands must come from a language adapter allowlist.
- Keep network access off by default and do not add telemetry.
- Never commit credentials, real user data, fabricated adoption metrics, or generated build output.
- Any feature that writes to GitHub must be opt-in, reviewable, and incapable of automatic merge.
- Run `corepack pnpm check` before submitting a pull request.
- Add tests for security boundaries and failure paths, not only happy paths.
