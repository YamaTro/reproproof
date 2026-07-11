FROM node:24.13.1-bookworm-slim AS build
WORKDIR /opt/reproproof
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json eslint.config.mjs ./
COPY packages ./packages
RUN corepack pnpm install --frozen-lockfile && corepack pnpm build && corepack pnpm prune --prod

FROM node:24.13.1-bookworm-slim
ENV NODE_ENV=production
RUN useradd --create-home --uid 10001 reproproof
WORKDIR /opt/reproproof
COPY --from=build --chown=reproproof:reproproof /opt/reproproof /opt/reproproof
USER 10001:10001
ENTRYPOINT ["node", "packages/cli/dist/index.js"]

# Runtime isolation must be supplied by the caller, for example:
# docker run --rm --network=none --read-only --cap-drop=ALL --security-opt=no-new-privileges \
#   --pids-limit=128 --cpus=1 --memory=1g --tmpfs=/tmp:size=1g ...
