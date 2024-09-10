import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://127.0.0.1:8000/api/restaurants/';

const EditRestaurant = () => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams(); // Restaurant ID from the URL
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}retrieve_restaurant/${id}/`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        });

        console.log('Fetched restaurant data:', response.data); // Log the entire response

        // Assuming response.data has a 'name' property
        if (response.data && response.data.name) {
          setName(response.data.name);
        } else {
          console.warn('Response data does not contain a name property:', response.data);
        }
      } catch (error) {
        setError('Error fetching restaurant');
        console.error('Error fetching restaurant:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await axios.put(`${API_BASE_URL}${id}/edit-restaurant/`, { name }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
      });

      console.log('Update successful'); // Log successful update

      navigate('/'); // Redirect after successful update
    } catch (error) {
      setError('You are not authorized to Update this restaurant');
      console.error('You are not authorized to Update this restaurant:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Edit Restaurant</h1>
      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Restaurant Name"
            required
            className="input"
          />
        </div>
        <div className="form-group">
          <button type="submit" className="button" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditRestaurant;
