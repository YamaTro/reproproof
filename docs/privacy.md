# Privacy

ReproProof is local-first and has no telemetry.

## Data processed

Issue Markdown, selected repository guidance/manifests, a provider candidate, test output, environment metadata, and generated reports. Reports may still contain source-derived information; review them before sharing.

## Provider behavior

- `mock`: no network and no external data transfer.
- `local`: only a loopback OpenAI-compatible endpoint is accepted. The separate local server has its own privacy behavior.
- `openai` and `anthropic`: selected issue and repository context leave the machine. The CLI refuses these providers without `--allow-external`. Their service terms and privacy policies apply.

The OpenAI adapter uses the raw Responses API with strict JSON-schema output and parses the documented `output` content array; it does not rely on the SDK-only `output_text` convenience property. This was verified against official OpenAI API documentation on 2026-07-11.

ReproProof does not silently fall back from local/mock to a cloud provider.

## Secrets

API keys are read only by the selected provider process and are not forwarded to child tests. Common secret formats are masked in captured output, but masking is not a guarantee. Do not put secrets in issue files, fixtures, or repositories used for reproduction.

## Retention

Local artifacts remain only in the chosen output directory. Disposable workspaces are deleted after each run. ReproProof itself sends no analytics. Cloud-provider retention is controlled by the selected provider and account settings.
