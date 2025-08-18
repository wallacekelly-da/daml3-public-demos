import OpenAPIClientAxios from "openapi-client-axios";
import type { Document as OpenAPIDocument } from 'openapi-client-axios';
import type { Client as LedgerApiHttpClient } from "./openapi.d.ts";
import yaml from 'js-yaml'

const openApiResponse = await fetch('/api/json-api/docs/openapi')
const openApiYaml = await openApiResponse.text()
const openApiDocument = yaml.load(openApiYaml) as OpenAPIDocument

const api = new OpenAPIClientAxios({
  definition: openApiDocument,
  axiosConfigDefaults: {
    baseURL: '/api/json-api',
  }
});

const ledgerApiHttpClient = await api.getClient<LedgerApiHttpClient>();

export default ledgerApiHttpClient;