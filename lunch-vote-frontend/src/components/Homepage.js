import React from 'react';

const Homepage = () => {
  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Welcome to the Lunch Vote App</h1>
      <p style={descriptionStyle}>Choose a restaurant to vote for lunch today.</p>
      <p style={linkContainerStyle}>
        <a href="/restaurants" style={linkStyle}>View Restaurants</a>
      </p>
      <p style={linkContainerStyle}>
        <a href="/winner" style={linkStyle}>See Today's Winner</a>
      </p>
    </div>
  );
};

const containerStyle = {
  textAlign: 'center',
  margin: '40px auto',
  padding: '20px',
  width: '80%',
  maxWidth: '600px',
  backgroundColor: '#f9f9f9',
  borderRadius: '8px',
  border: '1px solid #ddd',
};

const headingStyle = {
  fontSize: '2em',
  color: '#333',
  marginBottom: '20px',
};

const descriptionStyle = {
  fontSize: '1.2em',
  color: '#555',
  marginBottom: '20px',
};

const linkContainerStyle = {
  marginBottom: '10px',
};

const linkStyle = {
  fontSize: '1.1em',
  color: '#007bff',
  textDecoration: 'none',
  fontWeight: 'bold',
  transition: 'color 0.3s ease',
};



export default Homepage;
