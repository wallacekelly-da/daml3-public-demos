# Local Validator with Mock Auth

Copyright © 2025 Digital Asset (Switzerland) GmbH and/or its affiliates  
Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.


## Purpose

This demo shows how to setup a Canton Network validator node,
connected to DevNet,
with [mock-oauth2-server](https://github.com/navikt/mock-oauth2-server)
serving as the Identity Provider.

Why? for purposes of testing, diagnostics, and demo on your local machine.

## Checkout this demo

To checkout a demo using SSH, use:

```
git clone \
  git@github.com:wallacekelly-da/daml3-public-demos.git \
  --single-branch \
  --depth 1 \
  --branch local-validator-with-mockauth \
  local-validator-with-mockauth
```

Or using HTTPS:

```
git clone \
  https://github.com/wallacekelly-da/daml3-public-demos.git \
  --single-branch \
  --depth 1 \
  --branch local-validator-with-mockauth \
  local-validator-with-mockauth
```

And then CD into the folder.

```
cd local-validator-with-mockauth/local-validator-with-mockauth
```

## Download the validator Docker Compose

Based on <https://docs.dev.sync.global/validator_operator/validator_compose.html#compose-validator>:

1. Browse to <https://sync.global/sv-network>. Note the following for DevNet:

    * `migration_id` (e.g, `0`)
    * `version` (e.g, `0.4.4`)
    * A Super Validator Node, that you have `curl` access to, running the desired version.  
      (e.g., `https://scan.sv-1.dev.global.canton.network.digitalasset.com`)

2. Download [the Splice Node bundle](https://github.com/digital-asset/decentralized-canton-sync/releases) for the current version.

3. Extract the `/docker-compose/validator/` folder

    ```
    tar xzvf ~/Downloads/0.4.4_splice-node.tar.gz --strip-components=3 splice-node/docker-compose/validator/
    ```

4. Set some environment variables to match the results <https://sync.global/sv-network>:

    ```
    export MIGRATION_ID=???

    export IMAGE_TAG=???

    export SPONSOR_SV_ADDRESS=???
    ```

5. Get an onboarding secret:  
   (for the DA super-validator, this requires logging into the DA VPN)

    ```
    export ONBOARDING_SECRET=$(curl -X POST ${SPONSOR_SV_ADDRESS}/api/sv/v0/devnet/onboard/validator/prepare); echo ${ONBOARDING_SECRET}
    ```

6. Choose a name for your wallet user and node:

    ```
    export MY_WALLET_NAME=???
    ```

7. (Optional) Remove the following lines from the `compose.yaml` file:  
   (I find it easier to debug failures.)

    ```
    restart: always
    ```

## Add a mock-oauth2-server service

1. Append the following to the end of the `compose.yaml` file:

    ```
      mockauth:
        image: ghcr.io/navikt/mock-oauth2-server:2.2.1
        volumes:
          - ./mock-oauth2-server.json:/host/mock-oauth2-server.json
        environment:
          - LOG_LEVEL=DEBUG
          - JSON_CONFIG_PATH=/host/mock-oauth2-server.json
        ports:
          - 8080:8080
        hostname: mockauth
        networks:
          - ${DOCKER_NETWORK:-splice_validator}
    ```

2. In the `compose.yaml` file, add dependencies on the new `mockauth` service
   to the `participant` and `validator` services:

    ```
        depends_on:
          mockauth:
            condition: service_started
    ```

3. Create a `mock-oauth2-server.json` file:

    ```
    {
      "tokenCallbacks": [
        {
          "issuerId": "mockauth",
          "tokenExpiry": 3600,
          "requestMappings": [
            {
              "requestParam": "client_id",
              "match": "validator-client-id",
              "claims": {
                "aud": "${audience}",
                "sub": "ledger-api-user"
              }
            },
            {
              "requestParam": "client_id",
              "match": "wallet-ui-client-id",
              "claims": {
                "aud": "https://validator.example.com"
              }
            },
            {
              "requestParam": "client_id",
              "match": "ans-ui-client-id",
              "claims": {
                "aud": "https://validator.example.com"
              }
            }
          ]
        }
      ]
    }
    ```

4. Add an entry to the `/etc/hosts/` file:

    ```
    # Added by Wallace, July 9, 2025
    # So that Docker Compose-hosted mockauth addresses are the same
    # both within the Docker Compose network and from the host

    127.0.0.1      mockauth
    ```

5. Edit the `.env` file:

    ```
    # Authentication
    AUTH_URL="http://mockauth:8080/mockauth/"
    AUTH_JWKS_URL="http://mockauth:8080/mockauth/jwks"
    AUTH_WELLKNOWN_URL="http://mockauth:8080/mockauth/.well-known/openid-configuration"
    LEDGER_API_AUTH_AUDIENCE="https://ledger_api.example.com"
    LEDGER_API_AUTH_SCOPE="" # optional
    VALIDATOR_AUTH_AUDIENCE="https://validator.example.com"
    VALIDATOR_AUTH_CLIENT_ID="validator-client-id"
    VALIDATOR_AUTH_CLIENT_SECRET="ignored"
    LEDGER_API_ADMIN_USER="ledger-api-user"
    WALLET_ADMIN_USER="administrator"
    WALLET_UI_CLIENT_ID="wallet-ui-client-id"
    ANS_UI_CLIENT_ID="ans-ui-client-id"
    ```

## Start the Docker Compose

1. Delete any previously created node.

    ```
    docker volume rm splice-validator_postgres-splice

    docker volume rm splice-validator_domain-upgrade-dump
    ```

2. Start the Docker Compose, _with authentication enabled_ (`-a`).

   ```
   ./start.sh -s ${SPONSOR_SV_ADDRESS} -o "${ONBOARDING_SECRET}" -p "${MY_WALLET_NAME}" -m $MIGRATION_ID -w -a
   ```

3. Confirm the `mock-oauth2-server` is working:

    ```
    curl http://mockauth:8080/mockauth/jwks
    ```

    ```
    curl http://mockauth:8080/mockauth/.well-known/openid-configuration
    ```

    ```
    curl --location 'mockauth:8080/mockauth/token' \
        --header 'Content-Type: application/x-www-form-urlencoded' \
        --data-urlencode 'grant_type=client_credentials' \
        --data-urlencode 'client_id=validator-client-id' \
        --data-urlencode 'client_secret=ignored' \
        --data-urlencode 'audience=https://validator.example.com' \
        | jq --raw-output \
            '.access_token
            | split(".")
            | .[1]
            | @base64d' \
        | jq
    ```

4. Confirm that <http://wallet.localhost> redirects to the login page.

5. Login with the value of `MY_WALLET_NAME`.
