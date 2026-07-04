#!/usr/bin/env bash
# Build image, push to a registry, then pull+restart on a remote host.
# Override via env vars: REGISTRY, IMAGE_TAG, DEPLOY_HOST, REMOTE_DIR, CONTAINER_NAME, HTTP_PORT
set -euo pipefail

IMAGE_NAME="${IMAGE_NAME:-a-love-letter}"
IMAGE_TAG="${IMAGE_TAG:-$(git rev-parse --short HEAD 2>/dev/null || date +%Y%m%d-%H%M%S)}"
REGISTRY="${REGISTRY:-}"                          # e.g. ghcr.io/your-org
REMOTE_IMAGE="${REGISTRY:+$REGISTRY/}${IMAGE_NAME}:${IMAGE_TAG}"
DEPLOY_HOST="${DEPLOY_HOST:-user@your-server}"
REMOTE_DIR="${REMOTE_DIR:-/opt/a-love-letter}"
CONTAINER_NAME="${CONTAINER_NAME:-a-love-letter}"
HTTP_PORT="${HTTP_PORT:-8080}"

echo "▶ Building ${REMOTE_IMAGE}"
docker build -t "${REMOTE_IMAGE}" .

if [ -n "${REGISTRY}" ]; then
  echo "▶ Pushing to ${REGISTRY}"
  docker push "${REMOTE_IMAGE}"
fi

echo "▶ Deploying to ${DEPLOY_HOST}"
ssh "${DEPLOY_HOST}" "set -e
  mkdir -p '${REMOTE_DIR}'
  cd '${REMOTE_DIR}'
"

# Copy compose file + Dockerfile + nginx.conf to remote
scp docker-compose.yml nginx.conf Dockerfile "${DEPLOY_HOST}:${REMOTE_DIR}/"

ssh "${DEPLOY_HOST}" "set -e
  cd '${REMOTE_DIR}'
  export IMAGE='${REMOTE_IMAGE}'
  export HTTP_PORT='${HTTP_PORT}'
  export CONTAINER_NAME='${CONTAINER_NAME}'
  # docker compose v2 preferred; fallback to v1 if needed
  if docker compose version >/dev/null 2>&1; then
    docker compose pull web || true
    docker compose up -d --remove-orphans
  else
    docker pull '${REMOTE_IMAGE}' || true
    docker rm -f '${CONTAINER_NAME}' || true
    docker run -d --name '${CONTAINER_NAME}' \
      --restart unless-stopped \
      -p '${HTTP_PORT}':80 \
      '${REMOTE_IMAGE}'
  fi
"

echo "✅ Deployed ${REMOTE_IMAGE} to http://${DEPLOY_HOST#*@}:${HTTP_PORT}/"