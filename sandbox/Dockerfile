FROM node:24.13.1-bookworm-slim

ARG PYTEST_VERSION=8.4.1
RUN apt-get update \
    && apt-get install --yes --no-install-recommends python3 python3-venv \
    && python3 -m venv /opt/python \
    && /opt/python/bin/pip install --no-cache-dir "pytest==${PYTEST_VERSION}" \
    && ln -s /opt/python/bin/python /usr/local/bin/python \
    && rm -rf /var/lib/apt/lists/*

RUN useradd --no-create-home --uid 65532 --shell /usr/sbin/nologin reproproof
USER 65532:65532
WORKDIR /workspace

LABEL org.opencontainers.image.title="ReproProof sandbox" \
      org.opencontainers.image.description="Networkless runtime image for Node and Python reproduction candidates" \
      org.opencontainers.image.licenses="Apache-2.0"
