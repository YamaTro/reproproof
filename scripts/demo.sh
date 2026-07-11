#!/usr/bin/env bash
set -euo pipefail
corepack pnpm install --frozen-lockfile
corepack pnpm build
node packages/cli/dist/index.js --repo fixtures/node-test --issue fixtures/issues/node-add.md --provider mock --unsafe-local-execute --output .reproproof/demo
printf 'Report: %s\n' "$(pwd)/.reproproof/demo/report.md"
