import { useState, useEffect } from 'react';
import ledgerApiHttpClient from '../ledger-api-client/httpClient';
import type { ListUsersResponse } from '../ledger-api-client/openapi';

export function CantonUsers() {
  const [cantonUsers, setCantonUsers] = useState<ListUsersResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCantonUsers = async () => {
      try {
        const response = await ledgerApiHttpClient.getV2Users()
        if ('users' in response.data) {
          setCantonUsers(response.data)
        } else {
          setError(JSON.stringify(response.data))
        };
      }
      catch (e) {
        if (e instanceof Error)
          setError(e.message)
      }
      finally {
        setIsLoading(false)
      }
  }
    fetchCantonUsers();
  }, []);

  if (isLoading) {
    return <div>Loading Canton users...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error fetching Canton users: {error}</div>;
  }

  return (
    <div>
      <h2>Canton Users</h2>
      <p>Successfully fetched Canton users</p>
      <pre>{JSON.stringify(cantonUsers, null, 2)}</pre>
    </div>
  );
}