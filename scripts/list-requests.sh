#!/usr/bin/env bash
# Lists the active Request contracts that Alice can see, with their note and requestedAt.
#
# Usage: scripts/list-requests.sh
set -euo pipefail

ALICE=$(curl -fsS localhost:6864/v2/parties | jq -r '.partyDetails[].party | select(startswith("Alice::"))')
OFFSET=$(curl -fsS localhost:6864/v2/state/ledger-end | jq .offset)

jq -n --arg alice "$ALICE" --argjson offset "$OFFSET" '
  {
    activeAtOffset: $offset,
    eventFormat: {
      filtersByParty: {
        ($alice): {
          cumulative: [{
            identifierFilter: {
              TemplateFilter: { value: { templateId: "#MinLedgerTime:Main:Request", includeCreatedEventBlob: false } }
            }
          }]
        }
      },
      verbose: true
    }
  }' |
curl -fsS -X POST localhost:6864/v2/state/active-contracts \
  -H 'Content-Type: application/json' \
  -d @- | jq '.[].contractEntry.JsActiveContract.createdEvent.createArgument | {note, requestedAt}'
