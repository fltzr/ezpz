#!/bin/bash

# Check if stdout is a terminal
if [ -t 1 ]; then
  GREEN=$(tput setaf 2)
  RED=$(tput setaf 1)
  NC=$(tput sgr0)
else
  GREEN=''
  RED=''
  NC=''
fi

log() {
  local level="$1"
  shift
  local message="$*"
  local timestamp
  timestamp=$(date '+%Y-%m-%d %H:%M:%S')

  case "$level" in
    INFO)
      echo -e "${GREEN}[${timestamp}] [INFO]${NC} - $message"
      ;;
    ERROR)
      echo -e "${RED}[${timestamp}] [ERROR]${NC} - $message" >&2
      exit 1
      ;;
    *)
      echo -e "[${timestamp}] [${level}] - $message"
      ;;
  esac
}
