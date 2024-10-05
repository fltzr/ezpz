#!/bin/bash
set -eou pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/logging.sh"

if [[ -f ".env" ]]; then
  source ".env"
else
  log ERROR ".env file not found."
fi

REQUIRED_VARS=(IMAGE_NAME TAR_FILE REMOTE_KEY_PATH REMOTE_USER REMOTE_HOST REMOTE_DIR)
for VAR in "${REQUIRED_VARS[@]}"; do
  if [[ -z "${!VAR:-}" ]]; then
    log ERROR "${VAR} is required but not set."
  fi
done

cleanup() {
  if [[ -f "${TAR_FILE}" ]]; then
    rm "${TAR_FILE}"
    log INFO "Cleaned up local tar file."
  fi
}

trap cleanup EXIT

# Debugging information
log INFO "Starting deployment script..."
log INFO "Building Docker image: ${IMAGE_NAME}"
log INFO "Saving Docker image to tar file: ${TAR_FILE}"
log INFO "Copying tar file to remote host: ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}"

if [[ -f "${TAR_FILE}" ]]; then
  rm "${TAR_FILE}" && log INFO "Removed dangling tar file"
fi

docker build -t "${IMAGE_NAME}" . || log ERROR "Docker build failed."
docker save "${IMAGE_NAME}" > "${TAR_FILE}" || log ERROR "Failed to save Docker image."

log INFO "Removing dangling Docker images..."
docker image prune -f || log WARN "Failed to remove dangling Docker images."

log INFO "Successfully built and saved image to ${TAR_FILE}."
log INFO "Copying and deploying image to remote host..."

scp -i "${REMOTE_KEY_PATH}" "${TAR_FILE}" "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}" || log ERROR "SCP failed."

ssh -i "${REMOTE_KEY_PATH}" "${REMOTE_USER}@${REMOTE_HOST}" bash -s << EOF
  set -eou pipefail
  
  cd "${REMOTE_DIR}" || { echo "Failed to cd to ${REMOTE_DIR}"; exit 1; }
  docker compose down || { echo "Failed to bring down Docker Compose services; exit 1; }
  docker image rm "${IMAGE_NAME}" -f
  docker load -i "${TAR_FILE}" || { echo "Failed to load ${TAR_FILE} to Docker; exit 1; }
  docker compose up -d || { echo "Failed to start Docker Compose services"; exit 1; }
EOF

log INFO "Deployment completed on remote host."
