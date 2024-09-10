import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Homepage from './components/Homepage';
import RestaurantList from './components/RestaurantList';
import EditRestaurant from './components/EditRestaurant';
import Login from './components/Login';
import Register from './components/Register';
import WinnerDisplay from './components/WinnerDisplay';
import UserProfile from './components/UserProfile'; // Import the new component
import PastWinnerList from './components/PastWinnerList';


function App() {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/restaurants" element={<RestaurantList />} />
          <Route path="/edit-restaurant/:id" element={<EditRestaurant />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/winner" element={<WinnerDisplay />} />
          <Route path="/pastwinnerlist" element={<PastWinnerList />} />
          <Route path="/profile" element={<UserProfile />} /> {/* Add route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
