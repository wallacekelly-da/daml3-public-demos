# Local Validator with Mock Auth and CN Utilities

Copyright © 2025 Digital Asset (Switzerland) GmbH and/or its affiliates  
Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.


## Purpose

This demo shows how to: 

* setup a Canton Network validator node
* connected to DevNet
* with [mock-oauth2-server](https://github.com/navikt/mock-oauth2-server)
serving as the Identity Provider
* and with the CN Utilities installed.

Why? for purposes of testing, diagnostics, and demo on your local machine. This is _not_ intended for a production environment.

## Choose your own adventure

There are two alternative ways to use this Git repo. Either:

1. **Clone the repo** then jump to the [Set environment variables](#set-environment-variables) section.

    ```
    git clone \
      https://github.com/wallacekelly-da/daml3-public-demos.git \
      --single-branch \
      --depth 1 \
      --branch local-validator-with-mockauth \
      local-validator-with-mockauth

    cd local-validator-with-mockauth/local-validator-with-mockauth
    ```

2. **Start from scratch** with an empty folder and work through the entire README.

## Download the Validator Docker Compose

Based on <https://docs.dev.sync.global/validator_operator/validator_compose.html#compose-validator>:

1. Browse to <https://sync.global/sv-network>. Note the following for DevNet:

    * `version` (e.g, `0.4.5`)

2. Download [the Splice Node bundle](https://github.com/digital-asset/decentralized-canton-sync/releases) for the current version.

3. Extract the `/docker-compose/validator/` folder. For example:

    ```
    tar xzvf ~/Downloads/0.4.5_splice-node.tar.gz --strip-components=3 splice-node/docker-compose/validator/
    ```

## Optionally tweak the Docker Compose

1. Remove the following lines from the `compose.yaml` file:  
   (I find it easier to debug failures.)

    ```
    restart: always
    ```

2. Add the following to the `nginx.conf` to expose the `participant.localhost`'s JSON Ledger API:

    ```
    location /api/ {
      proxy_pass http://participant:7575/;
    }
    ```

3. Add the following to the `nginx.conf` to expose the `participant.localhost`'s gRPC Ledger API:

    ```
    server {
      listen 5001;
      http2 on;
      server_name participant.localhost;
      location / {
        grpc_pass grpc://participant:5001;
      }
    }

    server {
      listen 5002;
      http2 on;
      server_name participant.localhost;
      location / {
        grpc_pass grpc://participant:5002;
      }
    }
    ```

    _And_ add the following to the `compose.yaml` _for the nginx service_:  
    (not the participant service)

    ```
    ports:
      - 5001:5001
      - 5002:5002
    ```

_Note:_ The Validator APIs are already exposed via the `nginx.conf`. For example,  
`curl http://wallet.localhost/api/validator/v0/validator-user`.


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
                "aud": "http://validator.localhost",
                "sub": "ledger-api-user"
              }
            },
            {
              "requestParam": "client_id",
              "match": "ui-client-id",
              "claims": {
                "aud": "http://validator.localhost"
              }
            }
          ]
        }
      ]
    }
    ```

4. Edit the `.env` file:

    ```
    # Authentication
    AUTH_URL="http://mockauth:8080/mockauth/"
    AUTH_JWKS_URL="http://mockauth:8080/mockauth/jwks"
    AUTH_WELLKNOWN_URL="http://mockauth:8080/mockauth/.well-known/openid-configuration"
    LEDGER_API_AUTH_AUDIENCE="http://validator.localhost"
    LEDGER_API_AUTH_SCOPE="" # optional
    VALIDATOR_AUTH_AUDIENCE="http://validator.localhost"
    VALIDATOR_AUTH_CLIENT_ID="validator-client-id"
    VALIDATOR_AUTH_CLIENT_SECRET="ignored"
    LEDGER_API_ADMIN_USER="ledger-api-user"
    WALLET_ADMIN_USER="administrator"
    WALLET_UI_CLIENT_ID="ui-client-id"
    ANS_UI_CLIENT_ID="ui-client-id"
    ```

## Setup the DA Utilities

From <https://docs.digitalasset.com/utilities/0.7/canton-utility-setup/utility-setup-docker-compose.html>:

1. Append to the `.env` file:

    ```
    # Utility
    AUTH_AUTHORITY=${AUTH_URL}
    OIDC_AUTHORITY_URL=${AUTH_URL}
    AUTH_AUDIENCE=${LEDGER_API_AUTH_AUDIENCE}
    OIDC_AUTHORITY_LEDGER_API_AUDIENCE=${LEDGER_API_AUTH_AUDIENCE}
    VALIDATOR_CLIENT_SECRET=${VALIDATOR_AUTH_CLIENT_SECRET}
    VALIDATOR_CLIENT_ID=${VALIDATOR_AUTH_CLIENT_ID}
    CNS_UI_CLIENT_ID=${ANS_UI_CLIENT_ID}
    AUTH_CLIENT_ID="utility-ui-client-id"
    # from https://docs.digitalasset.com/utilities/0.7/canton-utility-setup/utility-setup.html#determine-the-utility-operator-party
    UTILITY_APP_OPERATOR_PARTY_ID=auth0_007c65f857f1c3d599cb6df73775::1220d2d732d042c281cee80f483ab80f3cbaa4782860ed5f4dc228ab03dedd2ee8f9
    # from https://docs.digitalasset.com/utilities/0.7/releases/index.html#current-environment-versions
    FRONTEND_IMAGE_VERSION=0.7.4

    # upload-utilities-dars.sh
    DAR_FOLDER=utility-dars
    PARTICIPANT_HOST=participant.localhost
    CANTON_ADMIN_GRPC_PORT=5002
    ```

2. Add a new service to the `compose.yaml`:

    ```
    utility-ui:
      image: "digitalasset-canton-network-utility-docker.jfrog.io/frontend:${FRONTEND_IMAGE_VERSION}"
      environment:
        - AUTH_AUTHORITY=${AUTH_AUTHORITY}
        - AUTH_CLIENT_ID=${AUTH_CLIENT_ID}
        - AUTH_AUDIENCE=${AUTH_AUDIENCE}
        - UTILITY_APP_OPERATOR_PARTY_ID=${UTILITY_APP_OPERATOR_PARTY_ID}
      depends_on:
        - participant
        - validator
      networks:
        - ${DOCKER_NETWORK:-splice_validator}
    ```

3. Add a new dependency to the nginx service in `compose.yaml`:

    ```
        depends_on:
          - utility-ui
    ```

4. Add a new request mapping to `mock-oauth2-server.json`:  
   (replacing `da-wallace-1` with your own value for `MY_WALLET_ID)

    ```
    {
      "requestParam": "client_id",
      "match": "utility-ui-client-id",
      "claims": {
        "aud": "http://validator.localhost",
        "sub": "da-wallace-1"
      }
    },
    ```

5. Add an HTTP server configuration to `nginx.conf`:

    ```
    server {
      listen 80;
      server_name utility.localhost;

      location /api/validator/ {
        rewrite ^\/(.*) /$1 break;
        proxy_pass http://validator:5003/api/validator;
      }

      location /api/json-api/ {
        proxy_pass http://participant:7575/;
      }

      location / {
        proxy_pass http://utility-ui:8080/;
      }
    }
    ```

6. Create an `upload-dars.sh` script:

    ```
    #!/bin/bash

    # --- CONFIGURATION ---

    if [ -f .env ]; then
      source .env
    fi

    DAR_FOLDER="${DAR_FOLDER:-"dars/"}"
    PARTICIPANT_HOST="${PARTICIPANT_HOST:-"localhost"}"
    PARTICIPANT_ADMIN_PORT="${PARTICIPANT_ADMIN_PORT:-"5002"}"

    # Set the base64 option. Use "-b 0" on BSD or macOS.
    BASE64_OPT="${BASE64_OPT:-"-w 0"}"

    # --- MAIN LOGIC ---

    if ! ls "$DAR_FOLDER"/*.dar >/dev/null 2>&1; then
      echo "Error: No .dar files found in '$DAR_FOLDER'." >&2
      exit 1
    fi

    for dar_file in "$DAR_FOLDER"/*.dar; do
      bytes=$(base64 ${BASE64_OPT} "$dar_file")
      description=$(basename "$dar_file")
      request=$(printf '{ "dars": [ { "bytes": "%s", "description": "%s" } ], "vet_all_packages": true, "synchronize_vetting": true }' "$bytes" "$description")

      echo "Uploading '$description' to ${PARTICIPANT_HOST}..."
      echo "$request" | grpcurl -plaintext -d @ \
        ${PARTICIPANT_HOST}:${PARTICIPANT_ADMIN_PORT} \
        com.digitalasset.canton.admin.participant.v30.PackageService.UploadDar
    done

    echo "Done."
    ```

    ```
    chmod +x ./upload-dars.sh
    ```

## Set environment variables

1. Browse to <https://sync.global/sv-network>. Note the following for DevNet:

    * `migration_id` (e.g, `0`)
    * `version` (e.g, `0.4.4`)
    * A Super Validator Node, that you have `curl` access to, _running the desired version_. For DA, that means you must be on the VPN.  
      (e.g., `https://scan.sv-1.dev.global.canton.network.digitalasset.com`)

2. Set some environment variables to match the results in <https://sync.global/sv-network>:

    * The `migration_id` above is stored in `MIGRATION_ID`:

      ```
      export MIGRATION_ID=???
      
      # e.g., export MIGRATION_ID=1
      ```
    
    * The `version` above is stored in `IMAGE_TAG`:

      ```
      export IMAGE_TAG=???
      
      # e.g., export IMAGE_TAG=0.4.5
      ```

    * The Super Validator's scan URL, replacing `https://scan.` with `https://sv.`:

      ```
      export SPONSOR_SV_ADDRESS=???

      # e.g., export SPONSOR_SV_ADDRESS=https://sv.sv-1.dev.global.canton.network.digitalasset.com

      # e.g., export SPONSOR_SV_ADDRESS=https://sv.sv-2.dev.global.canton.network.digitalasset.com
      ```

3. Get an onboarding secret:  
   (for the DA super-validator, this requires logging into the DA VPN)

    ```
    export ONBOARDING_SECRET=$(curl -X POST ${SPONSOR_SV_ADDRESS}/api/sv/v0/devnet/onboard/validator/prepare); echo ${ONBOARDING_SECRET}
    ```

4. Choose a name for your wallet user and node:

    ```
    export MY_WALLET_NAME=???
    
    # e.g., export MY_WALLET_NAME=da-wallace-1
    ```

## Set local domain names

1. Add the following to the `/etc/hosts` file:  
   (because `grpcurl` doesn't special-case the .localhost extension)

    ```
    # Added by Wallace, July 9, 2025
    # So that grpcurl would recognized the host name

    127.0.0.1      participant.localhost
    ```

2. Add the following to the `/etc/hosts/` file:

    ```
    # Added by Wallace, July 9, 2025
    # So that Docker Compose-hosted mockauth addresses are the same
    # both within the Docker Compose network and from the host

    127.0.0.1      mockauth
    ```


## Start the Docker Compose

1. (Optionally) Delete any previously created node.

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

4. Confirm the Legder API is exposed:

    ```
    grpcurl --plaintext participant.localhost:5001 list
    ```

5. Confirm the JSON Ledger API is exposed:

    ```
    curl http://participant.localhost/api/readyz
    ```

6. Confirm the Validator API is exposed:

    ```
    curl http://wallet.localhost/api/validator/v0/validator-user
    ```

7. Confirm that <http://wallet.localhost> redirects to the login page.

8. Login with the value of `MY_WALLET_NAME`, onboard yourself, and tap Canton Coins.

## Upload the Utility DAR files

Based on <https://docs.digitalasset.com/utilities/0.7/canton-utility-setup/utility-setup.html#upload-the-dars>:

1. Note the [latest versions of the Daml packages](https://docs.digitalasset.com/utilities/0.7/releases/index.html#current-environment-versions).

2. Download the current version from [JFrog](https://digitalasset.jfrog.io/artifactory/canton-network-utility/):

3. Extract the DAR files into a folder.

4. Set the `DAR_FOLDER` environment variable in the `.env` file.

5. Upload the DAR files into the ledger:

    ```
    ./upload-dars.sh
    ```

## Confirm Utilities is working

1. Confirm that <http://utility.localhost> redirects to the login page. Press the Login button.

2. Press the "Request Credential User Service" button. In DevNet, it should be approved automatically (evenutally).

## Shutdown the Docker Compose

1. Run the stop script.

    ```
    ./stop.sh
    ```

2. (Optionally) Delete the node.

    ```
    docker volume rm splice-validator_postgres-splice

    docker volume rm splice-validator_domain-upgrade-dump
    ```
