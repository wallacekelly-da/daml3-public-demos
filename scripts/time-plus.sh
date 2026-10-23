#!/usr/bin/env bash
# Prints a time, in ISO 8601 UTC, that is the given number of seconds after another time (default: now).
#
# Usage: scripts/time-plus.sh <seconds> [<time, ISO 8601>]
set -euo pipefail

jq -nr --argjson s "$1" --arg t "${2:-}" '(if $t == "" then now else ($t | fromdate) end) + $s | floor | todate'
