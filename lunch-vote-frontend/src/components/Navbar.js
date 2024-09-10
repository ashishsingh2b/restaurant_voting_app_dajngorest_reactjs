import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const isAuthenticated = localStorage.getItem('access_token') !== null;
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login'); // Redirect to login page
    window.location.reload(); // Optionally reload to reset the app state
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <Link to="/" style={styles.brand}>Home</Link>
        <ul style={styles.navList}>
          <li style={styles.navItem}>
            <Link to="/restaurants" style={styles.navLink}>Restaurants</Link>
          </li>
          {isAuthenticated ? (
            <>
              <li style={styles.navItem}>
                <Link to="/profile" style={styles.navLink}>Profile</Link>
              </li>
              <li style={styles.navItem}>
                <Link to="/winner" style={styles.navLink}>Winner</Link>
              </li>
              <li style={styles.navItem}>
                <Link to="/pastwinnerlist" style={styles.navLink}>PastWinnerList</Link>
              </li>
              <li style={styles.navItem}>
                <button onClick={handleLogout} style={styles.navButton}>Logout</button>
              </li>
            </>
          ) : (
            <>
              <li style={styles.navItem}>
                <Link to="/login" style={styles.navLink}>Login</Link>
              </li>
              <li style={styles.navItem}>
                <Link to="/register" style={styles.navLink}>Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

// Internal CSS styles
const styles = {
  navbar: {
    backgroundColor: '#333',
    color: '#fff',
    padding: '10px 20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '1.5em',
    fontWeight: 'bold',
  },
  navList: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
  },
  navItem: {
    marginLeft: '20px',
  },
  navLink: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '1em',
    fontWeight: 'normal',
    transition: 'color 0.3s ease',
  },
  navLinkHover: {
    color: '#ddd', // Light grey for hover effect
    textDecoration: 'underline',
  },
  navButton: {
    backgroundColor: '#ff0000',
    color: '#fff',
    border: 'none',
    padding: '10px 15px',
    fontSize: '1em',
    cursor: 'pointer',
    borderRadius: '5px',
    transition: 'background-color 0.3s ease',
  },
  navButtonHover: {
    backgroundColor: '#cc0000',
  },
};

export default Navbar;
