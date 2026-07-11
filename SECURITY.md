# Security policy

## Supported versions

ReproProof has not published a stable release. Security fixes apply to the latest commit on `main` until v0.1.0 is released.

## Reporting a vulnerability

Do not open a public issue for a suspected vulnerability. After publication, use GitHub's private vulnerability reporting for this repository. Until the repository URL exists, contact the maintainer through the private address they add to the GitHub security policy before release. Do not include real secrets or third-party personal data.

We aim to acknowledge reports within seven days and provide a status update within fourteen days. These are targets, not a paid support guarantee.

## Safety defaults

- issue and repository content are untrusted data;
- mock mode is the default and makes no model call;
- cloud providers require explicit `--allow-external` consent;
- the local-compatible provider accepts loopback hosts only;
- candidate paths must remain inside the disposable workspace;
- command selection is adapter-owned and allowlisted; issue text cannot request commands;
- child processes inherit no API keys or GitHub tokens;
- logs are masked for common secret formats;
- execution uses a disposable copy and a timeout;
- telemetry is absent and therefore off;
- Draft PR creation requires `--draft-pr --confirm-github-write`, an explicit issue URL, a verified reproduction, and a token. There is no automatic merge operation.

## Important limitation

Normal `--execute` is configured to use Docker with no network, a read-only root and repository mount, dropped capabilities, no-new-privileges, a non-root container user, PID/CPU/memory limits, bounded tmpfs, and a host timeout. This path is implemented but has not been exercised on this development machine because Docker is not installed. `--unsafe-local-execute` has none of those kernel/container controls and is only for repository-owned fixtures. See [the threat model](docs/threat-model.md).
