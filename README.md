# Daml Public Demos

Copyright © 2026 Digital Asset (Switzerland) GmbH and/or its affiliates  
Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

## Demo branches

Each demo is in its own Git branch. Browse the demos [here](https://github.com/wallacekelly-da/daml3-public-demos/branches/all).

To checkout this demo using SSH, use:

```
git clone \
  git@github.com:wallacekelly-da/daml3-public-demos.git \
  --single-branch \
  --depth 1 \
  --branch min-ledger-time \
  min-ledger-time
```

Or using HTTPS:

```
git clone \
  https://github.com/wallacekelly-da/daml3-public-demos.git \
  --single-branch \
  --depth 1 \
  --branch min-ledger-time \
  min-ledger-time
```

## Purpose

This demo shows how to use the `minLedgerTime` parameter when preparing a Canton transaction for external signing.

## Background

TODO: explain the motivation and overview of the technique.

## Demo Steps

1. Start a Canton sandbox locally in a dedicated terminal window.

    Command:

    ```sh
    dpm sandbox
    ```

    Sample output:

    ```plaintext
    sandbox listening at ports: 6865(gRPC) and 6864(HTTP)
    Canton sandbox is ready.
    ```

1. In a second terminal window, onboard an external party named `Alice`.

    This uses the [`external_party_onboarding.sh`](https://github.com/digital-asset/canton/blob/main/community/app/src/pack/examples/08-interactive-submission/external_party_onboarding.sh)
    script from the Canton interactive submission example.
    The script generates an Ed25519 key pair (`private_key.der`, `public_key.der`) in the current directory
    and onboards the party through the JSON Ledger API.
    It expects a second participant, so pass the sandbox for both `-p1` and `-p2`.
    The party ID is then read back from the ledger into `PARTY_ID`.
    Run this and the remaining steps in this same terminal and directory.

    Command:

    ```sh
    curl -fsSLO https://raw.githubusercontent.com/digital-asset/canton/main/community/app/src/pack/examples/08-interactive-submission/external_party_onboarding.sh
    bash external_party_onboarding.sh -p1 localhost:6864 -p2 localhost:6864 -n Alice

    PARTY_ID=$(curl -fsS localhost:6864/v2/parties | jq -r '.partyDetails[].party | select(startswith("Alice::"))')
    echo $PARTY_ID
    ```

    Sample output:

    ```plaintext
    Fetching localhost:6864/v2/state/connected-synchronizers
    Detected synchronizer-id "synchronizer-1::12201f16c7a4943f74c0cd02d9356d5139859c951f5cce6482cbbe254623fd2f6123"
    MCowBQYDK2VwAyEAb2m861MPZ5o2BQq3SXsG9zkcp+DhJtBcnEQ/KYjeIXs=
    Requesting generate topology transactions
    Signing hash EiCX+UEK5KtlU53ln/Jd9/IpA3RBKLYpqUL3c0sBW/81pw== for Alice::122080377ed70e482f1d18fd557b996fe0752ec1398c641ed9cf062340208fc17c4a using ED25519
    Submitting onboarding transaction to participant1
    Onboarded party "Alice::122080377ed70e482f1d18fd557b996fe0752ec1398c641ed9cf062340208fc17c4a"
    Alice::122080377ed70e482f1d18fd557b996fe0752ec1398c641ed9cf062340208fc17c4a
    ```

1. Prepare a transaction for the external party with `/v2/interactive-submission/prepare`.

    The built-in `Canton.Internal.Ping` template needs no DAR upload.
    `Alice` is both `initiator` and `responder`, so no second party is needed.
    The full response is saved to `prepare-response.json`; the output omits the large `preparedTransaction` field.

    Command:

    ```sh
    SYNCHRONIZER_ID=$(curl -fsS localhost:6864/v2/state/connected-synchronizers | jq -r '.connectedSynchronizers[0].synchronizerId')

    cat > prepare-request.json <<EOF
    {
      "userId": "demo-user",
      "commandId": "$(uuidgen)",
      "actAs": ["$PARTY_ID"],
      "synchronizerId": "$SYNCHRONIZER_ID",
      "packageIdSelectionPreference": [],
      "commands": [{
        "CreateCommand": {
          "templateId": "#canton-builtin-admin-workflow-ping:Canton.Internal.Ping:Ping",
          "createArguments": {
            "id": "external-signing-demo",
            "initiator": "$PARTY_ID",
            "responder": "$PARTY_ID"
          }
        }
      }]
    }
    EOF

    curl -fsS -X POST localhost:6864/v2/interactive-submission/prepare \
      -H 'Content-Type: application/json' \
      -d @prepare-request.json > prepare-response.json

    jq 'del(.preparedTransaction)' prepare-response.json
    ```

    Sample output:

    ```plaintext
    {
      "preparedTransactionHash": "KyFOoTCbLtXbtYwh5zaUQ90LFRGhfj1x5IKh265AziA=",
      "hashingSchemeVersion": "HASHING_SCHEME_VERSION_V2",
      "hashingDetails": null,
      "costEstimation": {
        "estimationTimestamp": "2026-10-23T14:22:13.746198Z",
        "confirmationRequestTrafficCostEstimation": 0,
        "confirmationResponseTrafficCostEstimation": 0,
        "totalTrafficCostEstimation": 0
      }
    }
    ```

1. Sign the `preparedTransactionHash` with the party's private key.

    This demo trusts the hash computed by the participant.
    Signing a raw Ed25519 message with `-rawin` requires OpenSSL 3 (for example, `brew install openssl@3`), not the LibreSSL that ships with macOS.

    Command:

    ```sh
    jq -r .preparedTransactionHash prepare-response.json | base64 --decode > hash.bin
    openssl pkeyutl -sign -inkey private_key.der -keyform DER -rawin -in hash.bin -out signature.bin
    SIGNATURE=$(base64 < signature.bin | tr -d '\n')
    echo $SIGNATURE
    ```

    Sample output:

    ```plaintext
    i5KJtRBKxa0Lda3QxkjZ36QH6PUsLnERLQbOMO6zWNNpDpGD+RwVJgKYLlshzfwIG9CNbspczt+K/9H2sQ3MDw==
    ```

1. Submit the prepared transaction and the signature with `/v2/interactive-submission/executeAndWait`.

    `signedBy` is the fingerprint of the party's key, which is the part of the party ID after `::`.

    Command:

    ```sh
    cat > execute-request.json <<EOF
    {
      "preparedTransaction": $(jq .preparedTransaction prepare-response.json),
      "hashingSchemeVersion": "HASHING_SCHEME_VERSION_V2",
      "userId": "demo-user",
      "submissionId": "$(uuidgen)",
      "deduplicationPeriod": { "Empty": {} },
      "partySignatures": {
        "signatures": [{
          "party": "$PARTY_ID",
          "signatures": [{
            "format": "SIGNATURE_FORMAT_CONCAT",
            "signature": "$SIGNATURE",
            "signedBy": "${PARTY_ID##*::}",
            "signingAlgorithmSpec": "SIGNING_ALGORITHM_SPEC_ED25519"
          }]
        }]
      }
    }
    EOF

    curl -fsS -X POST localhost:6864/v2/interactive-submission/executeAndWait \
      -H 'Content-Type: application/json' \
      -d @execute-request.json | jq
    ```

    Sample output:

    ```plaintext
    {
      "updateId": "1220244871d341c9f2809d0f18b7efdc31f5ab3d82970c8b4d863e17da19fe6302ab",
      "completionOffset": 10
    }
    ```
