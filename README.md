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

When a Daml choice reads the ledger time (for example, with `getTime`), the transaction prepared for external signing depends on that time.
The Canton protocol then requires the signed transaction to be recorded on the synchronizer within the synchronizer's `ledgerTimeRecordTimeTolerance` of its ledger time,
which is 60 seconds by default and on the Global Synchronizer today.
Because the ledger time is fixed when the transaction is prepared, any signing flow that takes longer than about a minute,
such as a custodian's approval workflow, a hardware wallet or a multi-person sign-off, fails with `NOT_SEQUENCED_TIMEOUT` or `LOCAL_VERDICT_LEDGER_TIME_OUT_OF_BOUND`.
This demo reproduces that failure and shows how to avoid it, using only the JSON Ledger API, `curl`, `jq` and `openssl` against a local Canton sandbox.

The technique is to schedule the transaction's ledger time instead of letting it default to the time of preparation.
First choose a scheduled time **T**: the synchronizer's current time plus a signing budget.
Then prepare the transaction with `minLedgerTime` set to T, so the transaction is evaluated as of T; any timestamps it records reflect T, not the moment it was approved.
Sign the prepared transaction within the budget, then wait until shortly before T (for example, T minus 30 seconds) and execute it, without setting `minLedgerTime` again.
The transaction is accepted if it is recorded within 60 seconds of T: executing too early or too late is rejected, and a new transaction must be prepared and signed.
The procedure works for any externally signed transaction, not only those that depend on time.

## Demo Steps

The setup steps (1–5) put the ledger in a state where `Alice`, an external party, can exercise a time-dependent choice as often as she likes.
The scenario steps (6–9) then prepare, sign and execute that choice with different delays between preparing and executing.

1. **Compile** the Daml model in `Main.daml` into a DAR.

    The `Service` contract is signed by a provider and observed by a customer.
    Its nonconsuming `MakeRequest` choice calls `getTime` and records the ledger time in a new `Request` contract.
    Because the choice is nonconsuming, the customer can exercise it any number of times on the same `Service` contract.

    Command:

    ```sh
    dpm build
    ```

    Sample output:

    ```plaintext
    Running single package build of MinLedgerTime as no multi-package.yaml was found.

    2026-10-23 16:55:44.16 [INFO]  [build] 
    Compiling MinLedgerTime to a DAR.

    2026-10-23 16:55:45.41 [INFO]  [build] 
    Created .daml/dist/MinLedgerTime-0.0.1.dar
    ```

1. **Start** a Canton sandbox locally in a dedicated terminal window, uploading the DAR.

    Command:

    ```sh
    dpm sandbox --dar .daml/dist/MinLedgerTime-0.0.1.dar
    ```

    Sample output:

    ```plaintext
    sandbox listening at ports: 6865(gRPC) and 6864(HTTP)
    Canton sandbox is ready.
    ```

1. **Onboard** an external party named `Alice`, in a second terminal window.

    This uses the [`external_party_onboarding.sh`](https://github.com/digital-asset/canton/blob/main/community/app/src/pack/examples/08-interactive-submission/external_party_onboarding.sh)
    script from the Canton interactive submission example.
    The script generates an Ed25519 key pair (`private_key.der`, `public_key.der`) in the current directory
    and onboards the party through the JSON Ledger API.
    It expects a second participant, so pass the sandbox for both `-p1` and `-p2`.
    The party ID is then read back from the ledger into `ALICE`.
    Run this and the remaining steps from the root of this project.

    Command:

    ```sh
    curl -fsSLO https://raw.githubusercontent.com/digital-asset/canton/main/community/app/src/pack/examples/08-interactive-submission/external_party_onboarding.sh
    bash external_party_onboarding.sh -p1 localhost:6864 -p2 localhost:6864 -n Alice

    ALICE=$(curl -fsS localhost:6864/v2/parties | jq -r '.partyDetails[].party | select(startswith("Alice::"))')
    echo $ALICE
    ```

    Sample output:

    ```plaintext
    Fetching localhost:6864/v2/state/connected-synchronizers
    Detected synchronizer-id "synchronizer-1::1220740ebed8adb4be9079f2d4a2e241765464f334848bf086e4a132afebe8c96bef"
    MCowBQYDK2VwAyEA70D3PvgA8LSsRs6XlO2u9krl+MzQL7YYsB/UARjcgeg=
    Requesting generate topology transactions
    Signing hash EiDiBkbCueNM26bXGejQHaOHJK3U/oh80OPOXtFU30MISw== for Alice::12200d8511e6ee62b32a4ec7c365671885efc5ae2e52c629ba4ecfd55ee70392b122 using ED25519
    Submitting onboarding transaction to participant1
    Onboarded party "Alice::12200d8511e6ee62b32a4ec7c365671885efc5ae2e52c629ba4ecfd55ee70392b122"
    Alice::12200d8511e6ee62b32a4ec7c365671885efc5ae2e52c629ba4ecfd55ee70392b122
    ```

1. **Create** a `Service` contract with `Alice` as the customer, submitting as the sandbox's local `sandbox::` party.

    The sandbox party is hosted on the participant, so it submits in a single call with `/v2/commands/submit-and-wait-for-transaction`.
    The response is saved to `service-response.json`, where the scripts in the next steps find the `Service` contract ID.

    Command:

    ```sh
    ALICE=$(curl -fsS localhost:6864/v2/parties | jq -r '.partyDetails[].party | select(startswith("Alice::"))')
    SANDBOX=$(curl -fsS localhost:6864/v2/parties | jq -r '.partyDetails[].party | select(startswith("sandbox::"))')

    cat > service-request.json <<EOF
    {
      "commands": {
        "userId": "demo-user",
        "commandId": "$(uuidgen)",
        "actAs": ["$SANDBOX"],
        "commands": [{
          "CreateCommand": {
            "templateId": "#MinLedgerTime:Main:Service",
            "createArguments": {
              "provider": "$SANDBOX",
              "customer": "$ALICE"
            }
          }
        }]
      }
    }
    EOF

    curl -fsS -X POST localhost:6864/v2/commands/submit-and-wait-for-transaction \
      -H 'Content-Type: application/json' \
      -d @service-request.json > service-response.json

    jq -r '.transaction.events[].CreatedEvent | select(.templateId | endswith(":Main:Service")) | .contractId' service-response.json
    ```

    Sample output:

    ```plaintext
    002e564a80bc533447d36f891953edaeeb37856e4255becef0b2f0a7e8a6a5b52eca121220e6e43c2ef7181e055ab4b1a2df35eb0f8124e6baa019c04899438980519f051d
    ```

1. **Review** the scripts in [`scripts/`](scripts) that the scenarios use for the external signing flow.

    | Script | What it does |
    |---|---|
    | [`prepare.sh <note> [<T>]`](scripts/prepare.sh) | Prepares `Alice`'s `MakeRequest` choice with `/v2/interactive-submission/prepare`. If a minimum ledger time **T** is given, it is sent as `minLedgerTime`. |
    | [`sign.sh`](scripts/sign.sh) | Signs the `preparedTransactionHash` with `Alice`'s private key. This demo trusts the hash computed by the participant. |
    | [`execute.sh`](scripts/execute.sh) | Submits the prepared transaction and the signature with `/v2/interactive-submission/executeAndWait`, without `minLedgerTime`. Errors are shortened to their `code` and `cause`. |
    | [`time-plus.sh <seconds> [<time>]`](scripts/time-plus.sh) | Adds seconds to a time (default: now). |
    | [`wait-until.sh <time>`](scripts/wait-until.sh) | Sleeps until a time. |
    | [`list-requests.sh`](scripts/list-requests.sh) | Lists the `Request` contracts that `Alice` can see. |

    The scripts look up the party IDs from the ledger and pass data to each other through files in the current directory,
    so run them from the root of this project.
    `sign.sh` requires OpenSSL 3 for `-rawin` (for example, `brew install openssl@3`), not the LibreSSL that ships with macOS.

    The key part of the prepare request is the minimum ledger time:

    ```json
    "minLedgerTime": {
      "time": {
        "MinLedgerTimeAbs": { "value": "2026-10-22T12:06:00Z" }
      }
    }
    ```

    The scripts schedule against the local clock.
    On a real network, schedule against the synchronizer's clock: read its record time with
    `GET /v2/state/ledger-end?synchronizer_id=<id>` and correct for the difference from the local clock.
    That record time only advances when there is activity on the synchronizer,
    so on an idle sandbox it can be minutes behind; here the sandbox shares this machine's clock instead.

1. **Simulate** a slow signer without `minLedgerTime` (scenario A).

    `MakeRequest` calls `getTime`, so the transaction depends on time and its ledger time is fixed when it is prepared.
    Signing takes longer than the synchronizer's 60-second `ledgerTimeRecordTimeTolerance`, so the transaction can no longer be recorded.

    Command:

    ```sh
    scripts/prepare.sh "A: slow signer"
    scripts/sign.sh
    scripts/wait-until.sh $(scripts/time-plus.sh 75)
    scripts/execute.sh
    ```

    Sample output:

    ```plaintext
    Prepared at 2026-10-23T16:56:16Z with minLedgerTime (none)
    Signed at 2026-10-23T16:56:16Z
    Waiting 75s until 2026-10-23T16:57:32Z
    Executing at 2026-10-23T16:57:32Z
    {
      "code": "NOT_SEQUENCED_TIMEOUT",
      "cause": "Transaction was not sequenced within the pre-defined max sequencing time and has therefore timed out"
    }
    ```

1. **Schedule** the submission with `minLedgerTime` and execute on time (scenario B).

    Choose **T** = now + signing budget (here 90 seconds), prepare with `minLedgerTime` = T,
    sign within the budget, then execute at T minus 30 seconds.
    The transaction is recorded within 60 seconds of T, so it is accepted.

    Command:

    ```sh
    T=$(scripts/time-plus.sh 90)
    scripts/prepare.sh "B: on time" $T
    scripts/sign.sh
    scripts/wait-until.sh $(scripts/time-plus.sh -30 $T)
    scripts/execute.sh
    ```

    Sample output:

    ```plaintext
    Prepared at 2026-10-23T16:57:33Z with minLedgerTime 2026-10-23T16:59:03Z
    Signed at 2026-10-23T16:57:33Z
    Waiting 60s until 2026-10-23T16:58:33Z
    Executing at 2026-10-23T16:58:34Z
    {
      "updateId": "122060ca4e14c633d6b36d97bf13e03c404792bd9a6c17a6c304e0886617abc6134f",
      "completionOffset": 21
    }
    ```

1. **Execute** too early (scenario C).

    The transaction is prepared with T three minutes in the future, then executed immediately.
    It is recorded more than 60 seconds before T, so the participant rejects it.

    Command:

    ```sh
    T=$(scripts/time-plus.sh 180)
    scripts/prepare.sh "C: too early" $T
    scripts/sign.sh
    scripts/execute.sh
    ```

    Sample output:

    ```plaintext
    Prepared at 2026-10-23T16:58:35Z with minLedgerTime 2026-10-23T17:01:34Z
    Signed at 2026-10-23T16:58:35Z
    Executing at 2026-10-23T16:58:35Z
    {
      "code": "LOCAL_VERDICT_LEDGER_TIME_OUT_OF_BOUND",
      "cause": "Rejected transaction as delta of the ledger time and the record time exceed the time tolerance ledgerTime=2026-10-23T17:01:34Z, recordTime=2026-10-23T16:58:35.480813Z, maxDelta=1m"
    }
    ```

1. **Execute** too late (scenario D).

    The transaction is prepared with T 30 seconds in the future, then executed 70 seconds after T.
    The window for recording it has already closed.

    Command:

    ```sh
    T=$(scripts/time-plus.sh 30)
    scripts/prepare.sh "D: too late" $T
    scripts/sign.sh
    scripts/wait-until.sh $(scripts/time-plus.sh 70 $T)
    scripts/execute.sh
    ```

    Sample output:

    ```plaintext
    Prepared at 2026-10-23T16:58:36Z with minLedgerTime 2026-10-23T16:59:05Z
    Signed at 2026-10-23T16:58:36Z
    Waiting 99s until 2026-10-23T17:00:15Z
    Executing at 2026-10-23T17:00:15Z
    {
      "code": "NOT_SEQUENCED_TIMEOUT",
      "cause": "Transaction was not sequenced within the pre-defined max sequencing time and has therefore timed out"
    }
    ```

1. **Inspect** the `Request` contracts that `Alice` can see.

    Only scenario B created a `Request`.
    Its `requestedAt` is the scheduled time T, not the time the transaction was executed:
    the transaction is evaluated as of its ledger time.

    Command:

    ```sh
    scripts/list-requests.sh
    ```

    Sample output:

    ```plaintext
    {
      "note": "B: on time",
      "requestedAt": "2026-10-23T16:59:03Z"
    }
    ```
