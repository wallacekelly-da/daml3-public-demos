import { useState, useEffect } from 'react';
import ledgerApiHttpClient from '../ledger-api-client/httpClient';
import type { GetLedgerApiVersionResponse } from '../ledger-api-client/openapi';

export function VersionCheck() {
  const [versionInfo, setVersionInfo] = useState<GetLedgerApiVersionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchVersion = async () => {
      const response = await ledgerApiHttpClient.getV2Version()
      setIsLoading(false)
      if ('version' in response.data) {
        setVersionInfo(response.data)
      } else {
        setError(response.data.cause)
      };
    }

    fetchVersion();
  }, []); // The empty array ensures this effect runs only once

  if (isLoading) {
    return <div>Loading version info...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error fetching version: {error}</div>;
  }

  return (
    <div>
      <h2>API Version Check</h2>
      <p>Successfully fetched version: <strong>{versionInfo?.version}</strong></p>
      <pre>{JSON.stringify(versionInfo, null, 2)}</pre>
    </div>
  );
}