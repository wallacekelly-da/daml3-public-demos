# mock-oauth2-sandbox3

## Purpose

Start Sandbox pointed at an instance of
[mock-oauth2-server](https://github.com/navikt/mock-oauth2-server).
This is helpful for testing and diagnostics of auth-related issues.

## Steps

1. **Clone** this code.

   ```
   git clone \
     https://github.com/wallacekelly-da/daml-public-demos.git \
       --single-branch \
       --depth 1 \
       --branch mock-oauth2-sandbox3 \
       mock-oauth2-sandbox3
   ```

1. **Start** the mock-oauth2-server:

    ```
    docker run -it --rm \
      --publish 8080:8080 \
      --env LOG_LEVEL=DEBUG \
      --env JSON_CONFIG_PATH=/host/mockauth.json \
      --volume ./mockauth.json:/host/mockauth.json \
      ghcr.io/navikt/mock-oauth2-server:3.0.0
    ```

    Confirm its health:

    ```
    curl http://localhost:8080/isalive
    ```

1. **Start** Sandbox:

    ```
    daml sandbox \
      --log-level-canton DEBUG \
      --config sandbox3.conf
    ```

    Confirm its health:

    ```
    curl http://localhost:7575/v2/version
    ```

    ```
    grpcurl -plaintext localhost:6865 grpc.health.v1.Health.Check
    ```

1. **Get** the participant id from the Admin API:

    ```
    export PARTICIPANT_ID=$( \
      grpcurl -plaintext localhost:6866 \
        com.digitalasset.canton.admin.participant.v30.ParticipantStatusService.ParticipantStatus \
          | jq -r '.status.commonStatus.uid' )
    echo $PARTICIPANT_ID
    ```

1. **Show** that a token is required to list the packages:

    ```
    curl http://localhost:7575/v2/packages
    ```

1. **Get** a JWT token for the `participant_admin` user:

    ```
    export ADMIN_TOKEN=$(\
      curl --silent \
        --location localhost:8080/mockauth/token \
        --header 'Content-Type: application/x-www-form-urlencoded' \
        --data-urlencode 'grant_type=client_credentials' \
        --data-urlencode 'client_id=participant_admin' \
        --data-urlencode 'client_secret=scope-based' \
        --data-urlencode 'participant_id='"$PARTICIPANT_ID" \
          | jq -r '.access_token')
    echo $ADMIN_TOKEN > at.jwt; \
    cat at.jwt
    ```

1. **List** the packages successfully _with a token_:

    ```
    curl http://localhost:7575/v2/packages \
      --header "Authorization: Bearer ${ADMIN_TOKEN}"
    ```

1. **Run** a script with the `participant_admin` token:

    ```
    daml build
    ```

    ```
    daml script \
      --dar .daml/dist/mockauth-0.0.1.dar \
      --upload-dar yes \
      --script-name Main:setup \
      --output-file asset.json \
      --ledger-host localhost \
      --ledger-port 6865 \
      --access-token-file at.jwt
    ```

1. **Get** a JWT token for `alice`:

    ```
    export ALICE_TOKEN=$(\
      curl --silent \
        --location localhost:8080/mockauth/token \
        --header 'Content-Type: application/x-www-form-urlencoded' \
        --data-urlencode 'grant_type=client_credentials' \
        --data-urlencode 'client_id=alice' \
        --data-urlencode 'client_secret=scope-based' \
        --data-urlencode 'participant_id='"$PARTICIPANT_ID" \
          | jq -r '.access_token')
    echo $ALICE_TOKEN > alice.jwt; \
    cat alice.jwt
    ```

1. **Create** a contract with the `alice` token:

    ```
    daml script \
      --dar .daml/dist/mockauth-0.0.1.dar \
      --script-name Main:createAsset \
      --input-file asset.json \
      --ledger-host localhost \
      --ledger-port 6865 \
      --access-token-file alice.jwt
    ```
