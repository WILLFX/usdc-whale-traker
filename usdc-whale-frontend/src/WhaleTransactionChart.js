import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { useQuery, gql } from '@apollo/client';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Title,
  Tooltip,
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Legend, Title, Tooltip);

const GET_WHALE_TRANSACTIONS = gql`
  query GetWhaleTransactions {
    transactions(first: 50, orderBy: timestamp, orderDirection: desc) {
      id
      value
      timestamp
    }
  }
`;

const WhaleTransactionChart = () => {
  const { loading, error, data, startPolling, stopPolling } = useQuery(GET_WHALE_TRANSACTIONS, {
    pollInterval: 10000, // Poll every 10 seconds
  });
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    if (data && data.transactions) {
      const smallTransactions = data.transactions.filter(
        (transaction) => transaction.value >= 1_000_000 && transaction.value < 10_000_000
      );
      const mediumTransactions = data.transactions.filter(
        (transaction) => transaction.value >= 10_000_000 && transaction.value < 100_000_000
      );
      const megaTransactions = data.transactions.filter(
        (transaction) => transaction.value >= 100_000_000
      );

      const formattedData = {
        labels: data.transactions.map((transaction) => {
          const date = new Date(transaction.timestamp * 1000);
          return date.toLocaleString(); // Format timestamp
        }),
        datasets: [
          {
            label: 'Small Transactions (1M - 10M USDC)',
            data: smallTransactions.map((transaction) => transaction.value),
            borderColor: 'green',
            fill: false,
          },
          {
            label: 'Medium Transactions (10M - 100M USDC)',
            data: mediumTransactions.map((transaction) => transaction.value),
            borderColor: 'orange',
            fill: false,
          },
          {
            label: 'Mega Transactions (100M+ USDC)',
            data: megaTransactions.map((transaction) => transaction.value),
            borderColor: 'red',
            fill: false,
          },
        ],
      };
      setChartData(formattedData);
    }
  }, [data]);

  if (loading) return <p>Loading chart...</p>;
  if (error) return <p>Error loading chart :(</p>;

  return (
    <div>
      <h2>Whale Transactions Over Time</h2>
      {chartData && chartData.labels ? (
        <Line data={chartData} />
      ) : (
        <p>No data available for chart</p>
      )}
    </div>
  );
};

export default WhaleTransactionChart;
