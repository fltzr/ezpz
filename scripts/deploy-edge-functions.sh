#!/bin/bash
source ".env"
source "./scripts/logging.sh"

SUPABASE_FUNCTIONS_DIR="supabase/functions"

usage() {
  log INFO "Usage: $0 [options]"
  log INFO ""
  log INFO "Options: "
  log INFO "    --all                         Deploy all supabase functions within '/supabase/functions/', excluding '_shared'"
  log INFO "    --only <FUNCTION_NAME>        Deploy only the function specified"
  log INFO "    --help                        Display this message"
  log INFO ""
  log INFO "Examples: "
  log INFO "    $0 --all"
  log INFO "    $0 --only plaid-create_link_token"
  log INFO ""
  exit 1
}

deploy_all() {

  if [[ ! -d "$SUPABASE_FUNCTIONS_DIR" ]]; then
    log ERROR "Error: '/supabase/functions/' does not exist at path ${SUPABASE_FUNCTIONS_DIR}"
    exit 1
  fi

  # Get list of functions in `/supabase/functions/` (excluding '_shared'), and convert into iterable array
  local FUNCTIONS=$(find $SUPABASE_FUNCTIONS_DIR -mindepth 1 -maxdepth 1 -type d ! -name '_shared' -exec basename {} \;)
  IFS=$'\n' read -r -d '' -a FUNCTIONS_ARRAY <<< "$FUNCTIONS"

  # Deploy each function to Supabase
  for edge_function in "${FUNCTIONS_ARRAY[@]}"; do
    supabase functions deploy "${edge_function}" --project-ref "${SUPABASE_PROJECT_REF}"
  done

  log INFO "Successfully deployed all supabase edge functions"

}

deploy_only() {
  local function="$1"

  supabase functions deploy "${function}" --project-ref "${SUPABASE_PROJECT_REF}"

}

if [ $# -eq 0 ]; then
  usage
fi

case "$1" in
  --all)
    if [[ $# -ne 1 ]]; then
      log ERROR "--all does not accept any additional arguments."
      usage
    fi
    deploy_all
    ;;
  --only)
    if [[ $# -ne 2 ]]; then
      log ERROR "--only requires exactly one argument: the function name."
      usage
    fi
    deploy_only "$2"
    ;;
  *)
    log ERROR "Unknown option: '${1}'"
    usage
    ;;
esac
