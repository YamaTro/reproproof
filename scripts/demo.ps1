$ErrorActionPreference = 'Stop'
corepack pnpm install --frozen-lockfile
corepack pnpm build
node packages/cli/dist/index.js --repo fixtures/node-test --issue fixtures/issues/node-add.md --provider mock --unsafe-local-execute --output .reproproof/demo
Write-Output "Report: $((Resolve-Path .reproproof/demo/report.md).Path)"
