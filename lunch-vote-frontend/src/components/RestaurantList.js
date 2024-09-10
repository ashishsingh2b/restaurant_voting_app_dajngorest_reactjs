import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './RestaurantList.css'; // Import the CSS file

const API_BASE_URL = 'http://127.0.0.1:8000/api/';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [votesLeft, setVotesLeft] = useState(0);
  const [newRestaurantName, setNewRestaurantName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userVotes, setUserVotes] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication status and token
    const checkAuth = () => {
      const token = localStorage.getItem('access_token');
      setIsAuthenticated(!!token);
    };

    checkAuth();
  }, []);

  useEffect(() => {
    // Fetch restaurant data
    const fetchRestaurants = async () => {
      if (!isAuthenticated) return;

      try {
        const response = await axios.get(`${API_BASE_URL}restaurants/`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        });

        const { restaurants, votesLeft: newVotesLeft } = response.data;
        setRestaurants(restaurants || []);
        setVotesLeft(newVotesLeft || 3);

        // Store user votes
        const votes = {};
        restaurants.forEach(restaurant => {
          votes[restaurant.id] = restaurant.user_vote || 'none';
        });
        setUserVotes(votes);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
        setError('Error fetching restaurants');
        setRestaurants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [isAuthenticated]);

  const handleVote = async (restaurantId) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/restaurants' } });
      return;
    }

    if (votesLeft <= 0) {
      alert('No votes left for today!');
      return;
    }

    const currentVoteValue = userVotes[restaurantId] || 'first';
    const voteOrder = ['first', 'second', 'third'];
    const nextVoteIndex = (voteOrder.indexOf(currentVoteValue) + 1) % 3;
    const nextVoteValue = voteOrder[nextVoteIndex];

    try {
      const response = await axios.post(`${API_BASE_URL}restaurants/vote/`,
        { restaurantId, voteType: nextVoteValue },
        { headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` } }
      );

      console.log("Vote",response.data)

      const { restaurants, votesLeft: newVotesLeft } = response.data;

      setRestaurants(restaurants || []);
      setVotesLeft(newVotesLeft || votesLeft);
      setUserVotes(prevVotes => ({ ...prevVotes, [restaurantId]: nextVoteValue }));

      // Determine vote points
      const votePoints = {
        'first': '1 point',
        'second': '0.5 points',
        'third': '0.25 points'
      }[nextVoteValue] || 'unknown';

      alert(`You have updated your vote to ${votePoints}.`);

    } catch (error) {
      handleApiError(error);
    }
  };

  const handleAddRestaurant = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/restaurants' } });
      return;
    }

    if (!newRestaurantName.trim()) {
      alert('Please enter a valid restaurant name.');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}restaurants/add_restaurant/`,
        { name: newRestaurantName.trim() },
        { headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` } }
      );
      setRestaurants(prevRestaurants => [...prevRestaurants, response.data]);
      setNewRestaurantName('');
    } catch (error) {
      console.error('Error adding restaurant:', error);
      alert('An error occurred while adding the restaurant.');
    }
  };

  const handleDeleteRestaurant = async (restaurantId) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/restaurants` } });
      return;
    }

    try {
      const response = await axios.delete(`${API_BASE_URL}restaurants/${restaurantId}/delete-restaurant/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
      });
      if (response.status === 204) {
        setRestaurants(prevRestaurants => prevRestaurants.filter(restaurant => restaurant.id !== restaurantId));
      } else {
        console.error('Unexpected response status:', response.status);
      }
    } catch (error) {
      console.error('Error deleting restaurant:', error);
      alert('You are not authorized to delete this restaurant.');
    }
  };

  const handleApiError = (error) => {
    console.error('API Error:', error);
    const errorMessage = error.response?.status === 403
      ? 'Daily vote limit reached. You’ve already voted 3 times today.'
      : error.response?.status === 400
      ? 'An error occurred while processing your vote.'
      : 'An error occurred while voting.';
    alert(errorMessage);
  };

  return (
    <div className="container">
      <h1>Restaurants</h1>
      <p>Total number of restaurants: {restaurants.length}</p>
      <p>User Can Vote 3 Per Day</p>
      {loading && <p className="loading">Loading, please wait...</p>}
      {error && <p className="alert">An error occurred: {error}</p>}

      {isAuthenticated ? (
        <div className="input-container">
          <h2>Add New Restaurant</h2>
          <input
            type="text"
            value={newRestaurantName}
            onChange={(e) => setNewRestaurantName(e.target.value)}
            placeholder="Restaurant Name"
          />
          <button onClick={handleAddRestaurant}>Add Restaurant</button>
        </div>
      ) : (
        <p>Please log in to add a restaurant or vote.</p>
      )}

      <table className="restaurant-table">
        <thead>
          <tr>
            <th>Sr.No</th>
            <th>Restaurant Name</th>
            <th>User</th>
            <th>Total Votes</th>
            <th>Vote Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {restaurants.length > 0 ? (
            restaurants.map((restaurant, index) => {
              const userVote = userVotes[restaurant.id] || 'none';
              const votePoints = {
                'first': '1 point',
                'second': '0.5 points',
                'third': '0.25 points'
              }[userVote] || 'Point';

              return (
                <tr key={restaurant.id}>
                  <td>{index + 1}</td>
                  <td>{restaurant.name}</td>
                  <td>{restaurant.user.username}</td>
                  <td>{restaurant.total_votes || 0}</td>
                  <td>{userVote.charAt(0).toUpperCase() + userVote.slice(1)}</td>
                  <td>
                    {isAuthenticated && (
                      <>
                        <button onClick={() => handleVote(restaurant.id)}>
                          Vote {votePoints}
                        </button>
                        <Link to={`/edit-restaurant/${restaurant.id}/`} className="LinkButton">Edit</Link>
                        <button onClick={() => handleDeleteRestaurant(restaurant.id)}>Delete</button>
                      </>
                    )}
                    {!isAuthenticated && <p>Login to vote</p>}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="6">No restaurants available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RestaurantList;

