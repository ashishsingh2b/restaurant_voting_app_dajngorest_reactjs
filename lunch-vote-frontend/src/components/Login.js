
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login/', { username, password });
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      navigate('/');
    } catch (error) {
      console.error('Error logging in', error);
      alert('Invalid credentials');
    }
  };

  return (
    <div>
      <style>
        {`
          .login-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px;
            background-color: #f5f5f5;
            min-height: 100vh; /* Ensures the container covers the full viewport height */
          }

          .form-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start; /* Aligns form to the top */
            margin-top: 20px; /* Space between top of viewport and form */
            width: 100%;
            max-width: 400px; /* Maximum width for the form */
          }

          .login-container h1 {
            margin-bottom: 20px;
            font-size: 2rem;
            color: #333;
          }

          .login-form {
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            width: 100%;
          }

          .login-form input,
          .login-form button {
            width: 100%;
            padding: 12px;
            margin-bottom: 10px;
            margin-left:1px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 1rem;
            box-sizing: border-box; /* Ensures padding and border are included in width/height */
            height: 48px; /* Explicitly set height for consistency */
          }

          .login-form input {
            border-color: #ccc;
          }

          .login-form button {
            background-color: #007bff;
            border: none;
            color: white;
            cursor: pointer;
          }

          .login-form button:hover {
            background-color: #0056b3;
          }
        `}
      </style>
      <div className="login-container">
        <div className="form-wrapper">
          <h1>Login</h1>
          <form onSubmit={handleSubmit} className="login-form">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
