import React from 'react';

const MintBurnEvents = ({ mintEvents, burnEvents }) => {
  const formatValue = (value) => {
    return new Intl.NumberFormat().format(value);
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString(); // Adjusts to a human-readable format
  };

  return (
    <div>
      <div className="table-section">
        <h3>Minting Events</h3>
        <table>
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>To</th>
              <th>Value (USDC)</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {mintEvents.length > 0 ? (
              mintEvents.map((event) => (
                <tr key={event.id}>
                  <td>{event.id}</td>
                  <td>{event.to.id}</td>
                  <td>{formatValue(event.value)}</td>
                  <td>{formatTimestamp(event.timestamp)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No minting events available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="table-section">
        <h3>Burning Events</h3>
        <table>
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>From</th>
              <th>Value (USDC)</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {burnEvents.length > 0 ? (
              burnEvents.map((event) => (
                <tr key={event.id}>
                  <td>{event.id}</td>
                  <td>{event.from.id}</td>
                  <td>{formatValue(event.value)}</td>
                  <td>{formatTimestamp(event.timestamp)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No burning events available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MintBurnEvents;
