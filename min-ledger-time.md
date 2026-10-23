# Long-Running External Signing with the JSON Ledger API

## Summary

When a Daml choice implementation relies on ledger time, the transaction prepared for signing will include that constraint.
At submission, the Canton protocol checks that the signed transaction still meets that time constraint.
The contract's developers can optionally relax this constraint by using Daml's ledger-time bound functions in the choice.
However, the default behavior is that the signed, submitted transaction must be within approximately 60s of the transaction's preparation time.

If your signing flow may take longer than the required submission time, you can do the following:

- set a future ledger time when preparing the transaction,
- sign within that lead time,
- and execute just before the scheduled time.

The procedure below works for any transaction (not just time constrained ones).
You can safely apply it to every externally signed submission.

For a step-by-step demo of this procedure against a local Canton sandbox, see the [README](./README.md#demo-steps).

## Procedure

In the steps below, the "scheduled time, **T**" is the ledger time that the signed transaction will contain.
You submit the transaction near time T.

### 1. Read synchronizer time and calculate the local time difference

Schedule against the synchronizer's clock, not your application server's clock.
Read the latest record time your participant has observed for the Global Synchronizer:

```http
GET /v2/state/ledger-end?synchronizer_id=<global-synchronizer-id>
```

The response includes the synchronizer's record time:

```json
{
  "offset": 123456,
  "synchronizerTimes": [
    {
      "synchronizerId": "global-domain::1220...",
      "recordTime": "2026-10-22T12:00:00.000Z"
    }
  ]
}
```

Calculate the difference between the synchronizer's clock and your local clock:

```text
localTimeDiff = recordTime - (local clock when the response arrived)
```

### 2. Choose the scheduled time T

```text
T = recordTime + signing budget
```

For a 6-minute signing budget, T = recordTime + 6 minutes.

### 3. Prepare the transaction with T as the minimum ledger time

```http
POST /v2/interactive-submission/prepare
```

```json
{
  "userId": "...",
  "commandId": "...",
  "actAs": ["<external-party-id>"],
  "synchronizerId": "<global-synchronizer-id>",
  "packageIdSelectionPreference": [],
  "commands": [ { "ExerciseCommand": { ... } } ],
  "minLedgerTime": {
    "time": {
      "MinLedgerTimeAbs": { "value": "2026-10-22T12:06:00Z" }
    }
  }
}
```

`minLedgerTime`: T. The transaction is evaluated using T as the expected time.
Use `MinLedgerTimeAbs`, not `MinLedgerTimeRel`, so that you know T exactly.

### 4. Sign the transaction

Sign `preparedTransactionHash` from the `/prepare` response with the external party's key, as you do today.

### 5. Wait until shortly before T

When signing finishes, wait until **T minus 30 seconds**, converted to your local clock:

```text
execute at (local clock) = T - 30 seconds - localTimeDiff
```

### 6. Execute the transaction

```http
POST /v2/interactive-submission/execute
```

(or `/v2/interactive-submission/executeAndWait`)

```json
{
  "preparedTransaction": "<from the prepare response>",
  "partySignatures": { ... },
  "hashingSchemeVersion": "<from the prepare response>",
  "submissionId": "<new UUID>",
  "userId": "...",
  "deduplicationPeriod": { ... }
}
```

Do not set `minLedgerTime` on the `/execute` request. The ledger time was fixed when you prepared.

The transaction must be recorded between T minus 60 seconds and T plus 60 seconds.
For example, executing at T minus 30 seconds leaves room for network and sequencing delays.

## Worked example

6-minute signing budget, synchronizer clock 2 seconds ahead of the local clock.

| Synchronizer time | Step | Values |
| :- | :- | :- |
| 12:00:00 | Read ledger end | recordTime = 12:00:00, localTimeDiff = +2 s |
| 12:00:01 | Prepare | minLedgerTime = 12:06:00Z |
| 12:00:02 to 12:05:00 | External party signs | Signs preparedTransactionHash |
| 12:05:30 | Execute (local clock 12:05:28) | No minLedgerTime |
| about 12:05:31 | Recorded on the synchronizer | Within 60 s of 12:06:00, accepted |

The demo's scenario B follows the same pattern with a 90-second signing budget.

## Troubleshooting

Both errors below are returned by `/execute` and `/executeAndWait` with HTTP status 409.
The demo's scenarios reproduce each of them.

| Error or symptom | Cause | What to do |
| :- | :- | :- |
| `LOCAL_VERDICT_LEDGER_TIME_OUT_OF_BOUND` | Executed too early: the transaction was recorded more than 60 seconds before T. The error's `cause` shows both times, for example `ledgerTime=…T17:01:34Z, recordTime=…T16:58:35Z, maxDelta=1m`. (Demo scenario C.) | Check localTimeDiff and the execute schedule. Prepare and sign again with a new T. |
| `NOT_SEQUENCED_TIMEOUT` | Executed too late to be recorded within 60 seconds after T. If execute is called after the window has already closed, this is returned immediately. This is also the error for a time-dependent transaction prepared without `minLedgerTime` whose signing took longer than about 60 seconds, because its T is effectively the preparation time. (Demo scenarios D and A.) | Prepare and sign again with a new T. Execute earlier in the window. |
| Prepare fails when minLedgerTime is set | The contract's own deadlines don't allow a ledger time that far in the future | Shorten the lead time, or check the contract's deadlines with its developers. |

## Things to know

- **The 60-second window is a network parameter.**
  It is the Global Synchronizer's `ledgerTimeRecordTimeTolerance`, 60 seconds today.
  Your validator operator can confirm the current value.
- **The transaction is evaluated as of T.**
  Any timestamps the transaction records reflect T, not the moment the user approved it.

## Reference documentation

Step-by-step demo:

- [README: Demo Steps](./README.md#demo-steps)

JSON Ledger API endpoints:

- [POST /v2/interactive-submission/prepare](https://docs.canton.network/reference/json-api-reference/post-v2interactive-submissionprepare)
- [POST /v2/interactive-submission/execute](https://docs.canton.network/reference/json-api-reference/post-v2interactive-submissionexecute)
- [POST /v2/interactive-submission/executeAndWait](https://docs.canton.network/reference/json-api-reference/post-v2interactive-submissionexecuteandwait)
- [POST /v2/interactive-submission/executeAndWaitForTransaction](https://docs.canton.network/reference/json-api-reference/post-v2interactive-submissionexecuteandwaitfortransaction)
- [GET /v2/state/ledger-end](https://docs.canton.network/reference/json-api-reference/get-v2stateledger-end)

External signing guides:

- [External Signing overview](https://docs.canton.network/appdev/deep-dives/external-signing)
- [Submitting Transactions, Part 1](https://docs.canton.network/appdev/deep-dives/external-signing-transactions-part-1)
- [Submitting Transactions, Part 2](https://docs.canton.network/appdev/deep-dives/external-signing-transactions-part-2)

Error codes:

- [LOCAL_VERDICT_LEDGER_TIME_OUT_OF_BOUND](https://docs.canton.network/global-synchronizer/reference/error-codes#error-code-local_verdict_ledger_time_out_of_bound)
- [NOT_SEQUENCED_TIMEOUT](https://docs.canton.network/global-synchronizer/reference/error-codes#error-code-not_sequenced_timeout)

Synchronizer parameters and troubleshooting:

- [Manage dynamic synchronizer parameters](https://docs.canton.network/global-synchronizer/extension-synchronizers/synchronizer-operations#manage-dynamic-synchronizer-parameters)
- [Transaction failures: timeout problems](https://docs.canton.network/global-synchronizer/troubleshooting-guide/transaction-failures#timeout-problems)
