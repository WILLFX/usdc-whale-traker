import React, { useEffect, useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import './WhaleTransactionTable.css'; // We will define color rules in the CSS

const GET_WHALE_TRANSACTIONS = gql`
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

const WhaleTransactionTable = () => {
  const { loading, error, data, startPolling, stopPolling } = useQuery(GET_WHALE_TRANSACTIONS, {
    pollInterval: 10000, // Poll every 10 seconds
  });
  const [smallTransactions, setSmallTransactions] = useState([]);
  const [mediumTransactions, setMediumTransactions] = useState([]);
  const [megaTransactions, setMegaTransactions] = useState([]);

  useEffect(() => {
    if (data && data.transactions) {
      // Categorize transactions
      const smallTx = data.transactions.filter(
        (transaction) => transaction.value >= 1_000_000 && transaction.value < 10_000_000
      );
      const mediumTx = data.transactions.filter(
        (transaction) => transaction.value >= 10_000_000 && transaction.value < 100_000_000
      );
      const megaTx = data.transactions.filter(
        (transaction) => transaction.value >= 100_000_000
      );

      setSmallTransactions(smallTx.slice(0, 10));
      setMediumTransactions(mediumTx.slice(0, 10));
      setMegaTransactions(megaTx.slice(0, 10));
    }
  }, [data]);

  const formatValue = (value) => {
    return new Intl.NumberFormat().format(value);
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString(); // Adjusts to a human-readable format
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      <h2 className="table-title">USDC Whale Transactions</h2>

      <div className="table-section">
        <h3 className="small-title">Small Transactions (1M - 10M USDC)</h3>
        <table className="small-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>From</th>
              <th>To</th>
              <th>Value (USDC)</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {smallTransactions.length > 0 ? (
              smallTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.id}</td>
                  <td>{transaction.from.id}</td>
                  <td>{transaction.to.id}</td>
                  <td>{formatValue(transaction.value)}</td>
                  <td>{formatTimestamp(transaction.timestamp)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No small transactions available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="table-section">
        <h3 className="medium-title">Medium Transactions (10M - 100M USDC)</h3>
        <table className="medium-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>From</th>
              <th>To</th>
              <th>Value (USDC)</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {mediumTransactions.length > 0 ? (
              mediumTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.id}</td>
                  <td>{transaction.from.id}</td>
                  <td>{transaction.to.id}</td>
                  <td>{formatValue(transaction.value)}</td>
                  <td>{formatTimestamp(transaction.timestamp)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No medium transactions available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="table-section">
        <h3 className="mega-title">Mega Transactions (100M+ USDC)</h3>
        <table className="mega-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>From</th>
              <th>To</th>
              <th>Value (USDC)</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {megaTransactions.length > 0 ? (
              megaTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.id}</td>
                  <td>{transaction.from.id}</td>
                  <td>{transaction.to.id}</td>
                  <td>{formatValue(transaction.value)}</td>
                  <td>{formatTimestamp(transaction.timestamp)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No mega transactions available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WhaleTransactionTable;
