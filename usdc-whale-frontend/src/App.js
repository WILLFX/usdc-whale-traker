import React, { useEffect, useState } from 'react';
import WhaleTransactionTable from './WhaleTransactionTable';
import WhaleTransactionChart from './WhaleTransactionChart';
import MintBurnEvents from './MintingBurningEvents'; // Assuming you have a component to handle mint/burn events
import { useQuery, gql } from '@apollo/client';

const GET_TRANSACTIONS = gql`
  query GetWhaleTransactions {
    transactions(first: 50, orderBy: timestamp, orderDirection: desc) {
      id
      from {
        id
      }
      to {
        id
      }
      value
      timestamp
    }
  }
`;

const GET_MINT_BURN_EVENTS = gql`
  query GetMintBurnEvents {
    mintEvents(first: 10, orderBy: timestamp, orderDirection: desc) {
      id
      to {
        id
      }
      value
      timestamp
    }
    burnEvents(first: 10, orderBy: timestamp, orderDirection: desc) {
      id
      from {
        id
      }
      value
      timestamp
    }
  }
`;

function App() {
  const { loading, error, data, startPolling } = useQuery(GET_TRANSACTIONS, {
    pollInterval: 10000, // Poll every 10 seconds
  });

  const { data: mintBurnData, loading: mintBurnLoading, error: mintBurnError } = useQuery(GET_MINT_BURN_EVENTS, {
    pollInterval: 10000, // Poll every 10 seconds
  });

  const [lastUpdate, setLastUpdate] = useState(null); // State to track last update timestamp

  useEffect(() => {
    if (data || mintBurnData) {
      setLastUpdate(new Date().toLocaleString()); // Update the last update timestamp whenever data changes
    }
  }, [data, mintBurnData]);

  if (loading || mintBurnLoading) return <p>Loading...</p>;
  if (error || mintBurnError) {
    console.error("Error fetching data", error || mintBurnError);
    return <p>Error: {error ? error.message : mintBurnError.message}</p>;
  }

  const transactions = data?.transactions || [];
  const mintEvents = mintBurnData?.mintEvents || [];
  const burnEvents = mintBurnData?.burnEvents || [];

  return (
    <div>
      <h1>USDC Whale Transactions Dashboard</h1>

      {/* Add a notification with the timestamp of the last update */}
      <p style={{ color: '#b3b3b3', fontStyle: 'italic' }}>
        Last updated: {lastUpdate ? lastUpdate : 'Loading...'} (Data is updated every 10 seconds)
      </p>

      <WhaleTransactionTable transactions={transactions} />
      <WhaleTransactionChart transactions={transactions} />

      <h2>USDC Minting and Burning Events</h2>
      <MintBurnEvents mintEvents={mintEvents} burnEvents={burnEvents} />
    </div>
  );
}

export default App;
