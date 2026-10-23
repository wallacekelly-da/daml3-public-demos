#!/usr/bin/env bash
# Prepares a transaction in which Alice exercises MakeRequest on the Service contract.
# If a minimum ledger time is given, it is sent as minLedgerTime.time.MinLedgerTimeAbs.
# Writes prepare-request.json and prepare-response.json.
#
# Usage: scripts/prepare.sh <note> [<minimum ledger time, ISO 8601>]
set -euo pipefail

NOTE=$1
MIN_LEDGER_TIME=${2:-}

ALICE=$(curl -fsS localhost:6864/v2/parties | jq -r '.partyDetails[].party | select(startswith("Alice::"))')
SYNCHRONIZER_ID=$(curl -fsS localhost:6864/v2/state/connected-synchronizers | jq -r '.connectedSynchronizers[0].synchronizerId')
SERVICE_CID=$(jq -r '.transaction.events[].CreatedEvent | select(.templateId | endswith(":Main:Service")) | .contractId' service-response.json)

jq -n --arg note "$NOTE" --arg t "$MIN_LEDGER_TIME" \
  --arg alice "$ALICE" --arg cid "$SERVICE_CID" --arg sync "$SYNCHRONIZER_ID" --arg cmd "$(uuidgen)" '
  {
    userId: "demo-user",
    commandId: $cmd,
    actAs: [$alice],
    synchronizerId: $sync,
    packageIdSelectionPreference: [],
    commands: [{
      ExerciseCommand: {
        templateId: "#MinLedgerTime:Main:Service",
        contractId: $cid,
        choice: "MakeRequest",
        choiceArgument: { note: $note }
      }
    }]
  }
  + if $t == "" then {} else { minLedgerTime: { time: { MinLedgerTimeAbs: { value: $t } } } } end
' > prepare-request.json

curl -fsS -X POST localhost:6864/v2/interactive-submission/prepare \
  -H 'Content-Type: application/json' \
  -d @prepare-request.json > prepare-response.json

echo "Prepared at $(date -u +%FT%TZ) with minLedgerTime ${MIN_LEDGER_TIME:-(none)}"
