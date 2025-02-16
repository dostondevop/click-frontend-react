import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../styles/dashboard.css';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="dashboard-container">
      <h1>Welcome, {user?.phone || user?.email}!</h1>
      <p>You are now logged in.</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Dashboard;
