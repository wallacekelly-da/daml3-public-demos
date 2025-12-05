# Two IDPs Example

This illustrates configuring two IDPs within a Canton Participant.

* A single Canton 3.x Sandbox
* Two instances of mockauth

## Demo Steps

1. Clone the repository:

    ```
    git clone \
      https://github.com/wallacekelly-da/daml3-public-demos.git \
      --single-branch \
      --depth 1 \
      --branch two-idps \
      two-idps
    ```

2. Start the Docker Compose:

    ```
    docker compose up --detach
    ```

3. Get the participant id:

    ```
    export PARTICIPANT_ID=$( \
      grpcurl -plaintext localhost:6866 \
        com.digitalasset.canton.admin.participant.v30.ParticipantStatusService.ParticipantStatus \
          | jq -r '.status.commonStatus.uid' );
    echo $PARTICIPANT_ID
    ```

4. Get a token for Alice:

    ```
    export ALICE_TOKEN=$( \
        curl -s http://localhost:8080/mockissuer1/token \
            -d grant_type=client_credentials \
            -d client_id=Alice \
            -d client_secret=ignored \
            -d participant=`echo $PARTICIPANT_ID` \
            | jq -r '.access_token'
    ); echo $ALICE_TOKEN
    ```

4. Get a token for Bob:

    ```
    export BOB_TOKEN=$( \
        curl -s http://localhost:8081/mockissuer2/token \
            -d grant_type=client_credentials \
            -d client_id=Bob \
            -d client_secret=ignored \
            -d participant=`echo $PARTICIPANT_ID` \
            | jq -r '.access_token'
    ); echo $BOB_TOKEN
    ```

5. Get user info for Alice:

    ```
    curl --location "http://localhost:7575/v2/users/Alice?identity-provider-id=mockauth1" \
        --header "Accept: application/json" \
        --header "Authorization: Bearer $ALICE_TOKEN"
    ```

6. Get user info for Bob:

    ```
    curl --location "http://localhost:7575/v2/users/Bob?identity-provider-id=mockauth2" \
        --header "Accept: application/json" \
        --header "Authorization: Bearer $BOB_TOKEN"
    ```

## Misc

Get user info using the Participant Admin:

    ```
    export ADMIN_TOKEN=$( \
        curl -s http://localhost:8080/mockissuer1/token \
            -d grant_type=client_credentials \
            -d client_id=participant_admin \
            -d client_secret=ignored \
            -d participant=`echo $PARTICIPANT_ID` \
            | jq -r '.access_token'
    ); echo $ADMIN_TOKEN
    ```

    ```
    curl --location "http://localhost:7575/v2/users/Alice?identity-provider-id=mockauth1" \
        --header "Accept: application/json" \
        --header "Authorization: Bearer $ADMIN_TOKEN"
    ```


Start a Canton Console:

```
docker compose --profile console run -it --rm
```

```
sandbox.health.status
```
