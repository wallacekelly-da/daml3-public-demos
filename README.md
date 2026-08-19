# Daml Public Demos

Copyright © 2025 Digital Asset (Switzerland) GmbH and/or its affiliates  
Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

## Demo checkout

Each demo is in its own Git branch. Browse the demos [here](https://github.com/wallacekelly-da/daml3-public-demos/branches/all).

To checkout a demo using SSH, use:

```
git clone \
  git@github.com:wallacekelly-da/daml3-public-demos.git \
  --single-branch \
  --depth 1 \
  --branch model-version-upgrades \
  model-version-upgrades
```

Or using HTTPS:

```
git clone \
  https://github.com/wallacekelly-da/daml3-public-demos.git \
  --single-branch \
  --depth 1 \
  --branch model-version-upgrades \
  model-version-upgrades
```

Additional demos can be found in the predecessor repo,  [daml-public-demos](https://github.com/wallacekelly-da/daml-public-demos).

## Demo steps

1. Build the two projects.

1. Start the sandbox.

1. Upload the V1 DAR to the sandbox.

1. Seed the ledger with V1 contracts.

1. Upload the V2 DAR to the sandbox.

1. Transfer an asset, noting that it was converted to V2 in the process.

1. Transfer the remaining assets.

1. Unvet the V1 package.


## Notes

In one terminal:

```
dpm sandbox
```

In another terminal:

* Setup with V1 contracts

```
dpm script --dar MyDar1/test/.daml/dist/MyTestsV1-0.0.1.dar --script-name MyCompany.V1.AssetsTest:setup --ledger-host localhost --ledger-port 6865 --upload-dar true --output-file setup.json
```

* List the contracts

```
dpm script --dar MyDar2/test/.daml/dist/MyTestsV2-0.0.2.dar --script-name MyCompany.V2.AssetsTest:list --ledger-host localhost --ledger-port 6865 --upload-dar true --input-file setup.json
```

* Call `Give` to convert the V1 contracts to V2

```
dpm script --dar MyDar2/test/.daml/dist/MyTestsV2-0.0.2.dar --script-name MyCompany.V2.AssetsTest:convert --ledger-host localhost --ledger-port 6865 --upload-dar true --input-file setup.json
```

* List the contracts again

```
dpm script --dar MyDar2/test/.daml/dist/MyTestsV2-0.0.2.dar --script-name MyCompany.V2.AssetsTest:list --ledger-host localhost --ledger-port 6865 --upload-dar true --input-file setup.json
```

## Todo

Unvet the V1 package.

