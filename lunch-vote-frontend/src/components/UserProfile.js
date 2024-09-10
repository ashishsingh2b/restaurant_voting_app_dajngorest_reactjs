import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/profile/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile', error);
        if (error.response && error.response.status === 401) {
          navigate('/login'); // Redirect to login if unauthorized
        }
      }
    };

    fetchProfile();
  }, [navigate]);

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>User Profile</h1>
      <p><strong>Username:</strong> {profile.username}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      {/* Add more profile fields if needed */}
    </div>
  );
};

export default UserProfile;
