# Threat model

Last reviewed: 2026-07-11.

## Assets

Host files, credentials, source confidentiality, maintainer time, repository integrity, CI minutes, provider budget, report integrity, and GitHub permissions.

## Adversaries and untrusted inputs

A malicious or compromised issue author, repository contributor, dependency, test script, model endpoint, or model output may attempt prompt injection, command execution, data exfiltration, denial of service, path escape, symlink abuse, secret leakage, or misleading “reproduced” evidence.

## Existing controls

| Threat | Current control | Residual risk |
|---|---|---|
| Prompt injection | system/provider instructions label inputs as data; static parser flags common patterns; commands never come from prose | model may still generate harmful code |
| Arbitrary command | adapter returns argv; executable allowlist; `shell: false` | allowed test runner can execute project code |
| Secret exfiltration | minimal child environment; cloud providers opt-in; mock default; loopback validation | source can read files accessible to the process if local isolation is bypassed |
| Path traversal | resolved-root containment and null-byte checks | Windows junction/reparse-point coverage needs more adversarial tests |
| Symlink escape | repository root and candidate-parent symlink checks; copy does not dereference | nested platform-specific links need hardened container validation |
| Resource exhaustion | timeout and bounded captured output | no CPU, memory, process-count, or disk quota locally |
| Network access | normal Docker execution uses `--network=none`; mock/provider generation is separate | unsafe local mode does not block egress |
| Secret in logs | pattern-based masking | novel formats and transformed secrets may evade patterns |
| False reproduction | status, confidence, exact command, exit code, logs, missing facts | a test can fail for the wrong reason; semantic validation is incomplete |
| GitHub write abuse | double opt-in flags, explicit issue URL, verified-reproduction gate, Draft-only API body, no merge endpoint, branch rollback on PR failure | token scope and live target-repository validation require operator care |
| Supply chain | lockfile, Dependabot, dependency review, CodeQL, release provenance plan | action dependencies and publish workflow still require live validation |

## Docker execution boundary

The implemented Docker path uses `--network=none`, a read-only root filesystem and repository mount, dropped capabilities, no-new-privileges, UID 65532, PID/CPU/memory limits, a 512 MB tmpfs write ceiling, no host socket mounts, a separately copied source tree, and a strict host wall-clock timeout. The image pins Node and pytest inputs. Dependency acquisition happens only while the maintainer explicitly builds the sandbox image, never inside a reproduction run.

This configuration still requires live validation on Linux and Windows Docker hosts, image vulnerability scanning, digest pinning after publication, and confirmation that the daemon uses its normal seccomp/AppArmor protections. A rootless Docker daemon is recommended but cannot be forced by the CLI. Unsafe local mode is never appropriate for hostile repositories.

## GitHub permissions target

Default Action permissions: `contents: read`. Draft PR use requires a separately supplied token scoped only to `contents: write` and `pull-requests: write`; the CLI creates Draft PRs only and has no approve or merge code path. The bundled Action does not enable writes.

## Abuse cases intentionally unsupported

Scanning repositories without authorization, vulnerability exploitation, autonomous external issue/PR submission, hidden telemetry, source upload without consent, automatic merge, and arbitrary issue-supplied setup commands.
