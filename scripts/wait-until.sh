#!/usr/bin/env bash
# Sleeps until the given time, by the local clock.
#
# Usage: scripts/wait-until.sh <time, ISO 8601>
set -euo pipefail

SECONDS_LEFT=$(( $(jq -nr --arg t "$1" '$t | fromdate') - $(date +%s) ))
echo "Waiting ${SECONDS_LEFT}s until $1"
if [ "$SECONDS_LEFT" -gt 0 ]; then sleep "$SECONDS_LEFT"; fi
