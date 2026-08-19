# Daml Public Demos

Copyright © 2026 Digital Asset (Switzerland) GmbH and/or its affiliates  
Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

## Demo Purpose

The purpose of this demo is to experiment with an alternative to running a MUT-style upgrade
when SCU-incompatible changes are desired.

To understand the code, keep in mind that there are _three_ versions of the template contained in two DARs.

* MyPackage-1.0.0 with:
   * The **original** template in a V1 module.
* MyPackage-2.0.0 with:
   * An **SCU-compatible upgrade** of the template, in the V1 module.
   * An **SCU-incompatible upgrade** of the template, in a new V2 module.
   * A new interface for both V1 and V2 contracts.

The process works as follows:

* The SCU-compatible upgrade in MyPackage-2.0.0 introduces a new interface implementation
which lazy-upgrades the V1 contracts to V2 contracts.
* The interface provides a way for V2 clients to query for and act on both V1 and V2 contracts.
* If necessary, a background process could upgrade existing contracts in the background.
* This makes zero downtime upgrades of some non-SCU changes possible.

## Demo checkout

To checkout the demo using SSH, use:

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


## Demo Overview

1. Start the sandbox.
1. Build the two projects.
1. Upload the V1 DAR.
1. Seed the ledger with V1 contracts.
1. Upload the V2 DAR.
1. Query the ledger using the V2 interface.
1. Transfer an asset, noting that it was upgraded to V2 in the process.
1. Transfer the remaining assets.
1. Unvet the V1 package after all assets are upgraded.

## Detailed Steps

1. **Start** the sandbox in its own terminal.

    ```sh
    dpm sandbox
    ```

2. **Build** the two projects from the `model-version-upgrades` folder.

    ```sh
    dpm build --all
    ```

3. **Upload** the V1 DAR to the sandbox.

    ```sh
    dpm canton-console
    ```

    ```scala
    sandbox.dars.upload("./MyDar1/main/.daml/dist/MyPackage-1.0.0.dar")

    exit
    ```

4. **Seed** the ledger with V1 contracts by running a Daml Script, `setup`.

    ```sh
    dpm script --dar MyDar1/test/.daml/dist/MyTestsV1-0.0.1.dar \
       --script-name MyCompany.V1.AssetsTest:setup \
       --ledger-host localhost \
       --ledger-port 6865 \
       --output-file setup.json
    ```

    Expected output:

    ```log
    [DA.Internal.Prelude:557]: V1 TV 'Bob::1220...'
    [DA.Internal.Prelude:557]: V1 VHS 'Charlie::1220...'
    [DA.Internal.Prelude:557]: V1 DVD 'Daniel::1220...'
    ```

5. **Upload** the V2 DAR.

    ```sh
    dpm canton-console
    ```

    ```scala
    sandbox.dars.upload("./MyDar2/main/.daml/dist/MyPackage-2.0.0.dar")

    exit
    ```

6. **Query** the ledger using the V2 interface from the Daml Script `listAssets`.

    ```sh
    dpm script --dar MyDar2/test/.daml/dist/MyTestsV2-0.0.2.dar \
      --script-name MyCompany.V2.AssetsTest:listAssets \
      --ledger-host localhost \
      --ledger-port 6865 \
      --input-file setup.json
    ```

    Expected output:

    ```log
    [DA.Internal.Prelude:557]: V1 TV 'Bob::1220...'
    [DA.Internal.Prelude:557]: V1 VHS 'Charlie::1220...'
    [DA.Internal.Prelude:557]: V1 DVD 'Daniel::1220...'
    ```

7. **Transfer** an asset with the Daml Script `returnAsset`.

    ```
    dpm script --dar MyDar2/test/.daml/dist/MyTestsV2-0.0.2.dar \
      --script-name MyCompany.V2.AssetsTest:returnAsset \
      --ledger-host localhost \
      --ledger-port 6865 \
      --input-file setup.json
    ```

    Expected output:

    ```
    [DA.Internal.Prelude:557]: Returning TV to Alice
    ```

   **List** the contracts.

    ```
    dpm script --dar MyDar2/test/.daml/dist/MyTestsV2-0.0.2.dar \
      --script-name MyCompany.V2.AssetsTest:listAssets \
      --ledger-host localhost \
      --ledger-port 6865 \
      --input-file setup.json
    ```

   Expected output:

   ```
   [DA.Internal.Prelude:557]: V1 VHS 'Charlie::1220...'
   [DA.Internal.Prelude:557]: V1 DVD 'Daniel::1220...'
   [DA.Internal.Prelude:557]: V2 TV 'Alice::1220...'
   ```

   **Note** that one of the V1 contracts was upgraded to V2
   when the transfer was performed.

8. **Repeat** the last two steps to see all the contracts upgrade.

9. **Unvet** the V1 package after all assets are upgraded.

```sh
dpm canton-console
```

```scala
// note the V1 package id
sandbox.dars.list(filterName = "MyPackage")

// confirm the V1 package is vetted
sandbox.topology.vetted_packages.list().
  filter(_.item.packages.exists(_.packageId == "95c7...")).
  map(r => (r.context.storeId, r.item.participantId))

// unvet the V1 package id
sandbox.dars.vetting.disable("95c7...")

// confirm the V1 package is unvetted
sandbox.topology.vetted_packages.list().
  filter(_.item.packages.exists(_.packageId == "95c7...")).
  map(r => (r.context.storeId, r.item.participantId))
```

## Review the code

MyPackage-1.0.0

* The original template, [V1.Assets.Asset](MyDar1/main/daml/MyCompany/V1/Assets.daml).

MyPackage-2.0.0

* The target template, [V2.Assets.Asset](MyDar2/main/daml/MyCompany/V2/Assets.daml).
* The V2 interface, [V2.Interfaces](MyDar2/interfaces/daml/MyCompany/V2/Interfaces.daml).
* The SCU-compatible template, [V1.Assets.Asset](MyDar2/main/daml/MyCompany/V1/Assets.daml).

