#!/usr/bin/env bash
# Executes the prepared transaction in prepare-response.json with the signature in signature.bin.
# Does not set minLedgerTime: the ledger time was fixed when the transaction was prepared.
# Prints the response, shortened to code and cause for errors. Writes execute-request.json.
#
# Usage: scripts/execute.sh
set -euo pipefail

ALICE=$(curl -fsS localhost:6864/v2/parties | jq -r '.partyDetails[].party | select(startswith("Alice::"))')
SIGNATURE=$(base64 < signature.bin | tr -d '\n')

cat > execute-request.json <<JSON
{
  "preparedTransaction": $(jq .preparedTransaction prepare-response.json),
  "hashingSchemeVersion": "HASHING_SCHEME_VERSION_V2",
  "userId": "demo-user",
  "submissionId": "$(uuidgen)",
  "deduplicationPeriod": { "Empty": {} },
  "partySignatures": {
    "signatures": [{
      "party": "$ALICE",
      "signatures": [{
        "format": "SIGNATURE_FORMAT_CONCAT",
        "signature": "$SIGNATURE",
        "signedBy": "${ALICE##*::}",
        "signingAlgorithmSpec": "SIGNING_ALGORITHM_SPEC_ED25519"
      }]
    }]
  }
}
JSON

echo "Executing at $(date -u +%FT%TZ)"
curl -sS -X POST localhost:6864/v2/interactive-submission/executeAndWait \
  -H 'Content-Type: application/json' \
  -d @execute-request.json | jq 'if .code then {code, cause} else . end'
