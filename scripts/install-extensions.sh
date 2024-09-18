#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/logging.sh"

cleanup() {
  local file="${1}"
  [[ -f "$file" ]] && rm -f "$file"
}

install_extension() {
  local url="${1}"
  local name="$(dirname "${url}")"
  local temp_file=$(mktemp /tmp/ext.XXXX.vsix)

  local curl_config=(
    --config /dev/null
    -fsSL
  )

  if ! curl "${curl_config[@]}" -o "${temp_file}" "${url}"; then
    log ERROR "Failed to download ${name} from ${url}" >&2
    cleanup "${temp_file}"
    return 1
  fi

  if ! code --install-extension "${temp_file}"; then
    log ERROR "Failed to install ${name} to VSCode. You may have to perform this manually." >&2
    cleanup "${temp_file}"
    return 1
  fi

  log ERROR "Successfully installed ${name}"
  cleanup "${temp_file}"
}

urls=(
  "https://localhost:4000/extensions/hehe.vsix"
  "haha.vsix"
)

for url in "${urls[@]}"; do
  if ! install_extension "${url}"; then
    log ERROR "Warning: continuing to next extension despite the error." >&2
  fi
done
