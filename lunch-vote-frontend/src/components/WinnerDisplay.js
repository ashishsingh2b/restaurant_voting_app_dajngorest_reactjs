import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_BASE_URL = 'http://127.0.0.1:8000/api/history/todays_winner/';

const WinnerDisplay = () => {
  const [todaysWinner, setTodaysWinner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTodaysWinner = async () => {
      try {
        const response = await axios.get(API_BASE_URL, {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        });
        setTodaysWinner(response.data);
      } catch (err) {
        console.error('Error fetching today\'s winner', err);
        if (err.response && err.response.status === 404) {
          setError('No winner for today yet');
        } else {
          setError('Error fetching today\'s winner');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTodaysWinner();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="todays-winner">
      <h1>Today's Winner</h1>
      {todaysWinner ? (
        <div className="winner-details">
          <strong>Date:</strong> {todaysWinner.date} <br />
          <strong>Winner:</strong> {todaysWinner.winner_name || 'No name available'} <br />
          <strong>Total Votes:</strong> {todaysWinner.total_votes || 'N/A'}
        </div>
      ) : (
        <div className="no-winner">
          No winner for today yet
        </div>
      )}
      <div className="link-button">
        <Link to="/pastwinnerlist">View Past Winners</Link>
      </div>
      <style jsx>{`
        .todays-winner {
          padding: 20px;
          margin: 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background-color: #f9f9f9;
          max-width: 600px;
          margin: auto;
          text-align: center;
        }

        .winner-details {
          font-size: 18px;
          line-height: 1.6;
          margin-bottom: 20px;
        }

        .loading {
          text-align: center;
          font-size: 20px;
          color: #007bff;
        }

        .error {
          text-align: center;
          font-size: 20px;
          color: red;
        }

        .no-winner {
          font-size: 18px;
          color: #555;
        }

        h1 {
          color: #333;
        }

        .link-button {
          margin-top: 20px;
        }

        .link-button a {
          text-decoration: none;
          color: #007bff;
          background-color: #f1f1f1;
          padding: 10px 20px;
          border: 1px solid #007bff;
          border-radius: 5px;
          font-size: 16px;
        }

        .link-button a:hover {
          background-color: #e9e9e9;
        }
      `}</style>
    </div>
  );
};

export default WinnerDisplay;
