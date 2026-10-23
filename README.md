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

