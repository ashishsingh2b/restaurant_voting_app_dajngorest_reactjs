import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const PastWinnerList = () => {
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistoricalWinners = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/history/historical_winners/', {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        });

        console.log("Historical Winners Data:", response.data);

        setWinners(response.data || []);
      } catch (err) {
        console.error('Error fetching historical winners', err);
        setError('Error fetching historical winners');
        setWinners([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoricalWinners();
  }, []);

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px'
  };

  const thTdStyle = {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'left'
  };

  const thStyle = {
    ...thTdStyle,
    backgroundColor: '#f2f2f2'
  };

  const winnerNameStyle = {
    maxWidth: '200px', // Adjust this value as needed
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  };

  const errorStyle = {
    color: 'red'
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div style={errorStyle}>{error}</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Past Winners</h1>
      <Link to="/">
        <button>Back to Main Page</button>
      </Link>

      {winners.length > 0 ? (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Sr.No</th> {/* Serial Number Column */}
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Winner</th>
              <th style={thStyle}>Total Votes</th>
            </tr>
          </thead>
          <tbody>
            {winners.map((entry, index) => (
              <tr key={index}>
                <td style={thTdStyle}>{index + 1}</td> {/* Serial Number */}
                <td style={thTdStyle}>{entry.date}</td>
                <td style={{ ...thTdStyle, ...winnerNameStyle }}>{entry.winner_name || 'No name available'}</td>
                <td style={thTdStyle}>{entry.total_votes || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>No historical winners yet</div>
      )}
    </div>
  );
};

export default PastWinnerList;
