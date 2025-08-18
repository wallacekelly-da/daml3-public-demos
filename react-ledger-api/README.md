# React with Ledger API Sample

Copyright © 2025 Digital Asset (Switzerland) GmbH and/or its affiliates  
Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

## Purpose

Provide a sample of interacting with the Canton 3.x JSON Ledger API from a React SPA.

## Demo branches

Each demo is in its own Git branch. Browse the demos [here](https://github.com/wallacekelly-da/daml3-public-demos/branches/all).

To checkout this demo using SSH, use:

```
git clone \
  git@github.com:wallacekelly-da/daml3-public-demos.git \
  --single-branch \
  --depth 1 \
  --branch react-ledger-api \
  react-ledger-api
```

Or using HTTPS:

```
git clone \
  https://github.com/wallacekelly-da/daml3-public-demos.git \
  --single-branch \
  --depth 1 \
  --branch react-ledger-api \
  react-ledger-api
```

Additional demos can be found in the predecessor repo,  [daml-public-demos](https://github.com/wallacekelly-da/daml-public-demos).

## Creation

These are the steps taken to create this demo.

1. Create the React + TypeScript + Vite application.

    ```
    # Restart from scratch
    rm -rf react-ledger-api

    # Create a new project from a template
    npm create vite@latest react-ledger-api -- --template react-ts

    # Change into the new folder
    cd react-ledger-api

    # Restore these instructions
    git restore README.md
    ```

1. Install the dependencies.

    ```
    # Install the template dependencies
    npm install

    # Add dependencies for the REST client
    npm install axios openapi-client-axios js-yaml

    # Add dev dependencies for generating TypeScript types from the Open API specs
    npm install --save-dev openapi-typescript @types/js-yaml npm-run-all
    ```

1. Add a new Daml project.

    ```
    DAML_SDK_VERSION=3.4.0-snapshot.20250813.1 daml new daml/Assets

    npm pkg set scripts.build="daml build --project-root daml/Assets && tsc -b && vite build"

    npm pkg set scripts.dev:vite="$(npm pkg get scripts.dev | jq -r)"

    npm pkg set scripts.dev:canton="cd daml/Assets && DAML_SDK_VERSION=3.4.0-snapshot.20250813.1 daml start --json-api-port 7575"

    npm pkg set scripts.dev="npm-run-all --parallel dev:vite dev:canton"
    ```

1. Add a proxy for the JSON Ledger API to vite.config.ts:

    ```
    export default defineConfig({
      plugins: [react()],
      server: {
        proxy: {
          // Proxy requests from /docs to your API server
          '/api/json-api': {
            target: 'http://localhost:7575',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api\/json-api/, ''),
          },
        },
      },
    })
    ```

1. Run the project.

    ```
    npm run dev
    ```

1. Download the Open API spec.

    ```
    mkdir src/ledger-api-client

    curl http://localhost:7575/docs/openapi \
      > src/ledger-api-client/openapi.ledger.3.4.0.yaml
    ```

1. Run a script for generating the Ledger API types:

    ```
    npm pkg set scripts.generate:ledger-api-types="npx openapicmd typegen src/ledger-api-client/openapi.ledger.3.4.0.yaml > src/ledger-api-client/openapi.d.ts"

    npm run generate:ledger-api-types
    ```

1. Restore several files:  
   (assuming you did a `rm -rf react-ledger-api`)

    ```
    git restore ./src/ledger-api-client/httpClient.ts

    git restore ./src/components/VersionCheck.tsx

    git restore ./src/components/CantonUsers.tsx

    git restore ./src/App.tsx

    git restore ./src/App.css
    ```

1. Create a client for the HTTP REST (Open API):

    * [./src/ledger-api-client/httpClient.ts](./src/ledger-api-client/httpClient.ts) file.  

1. Create React components to use the endpoints. For example:

    * [./components/VersionCheck.tsx](./src/components/VersionCheck.tsx)  

    * [./components/CantonUsers.tsx](./src/components/CantonUsers.tsx)  

1. Add the React components to the [./src/App.tsx](./src/App.tsx).  
   For example:

    ```
    import { VersionCheck } from './components/VersionCheck'
    import { CantonUsers } from './components/CantonUsers'
             :
             :
        <VersionCheck />
        <CantonUsers />
    ```
