import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/loginRegister.css';

const LoginRegister = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [existingUser, setExistingUser] = useState(false);
  const [error, setError] = useState('');

  // Step 1: Check if user exists by phone & email
  const handleCheckUser = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(
        `http://localhost:8080/api/checkUser?phone=${phone}&email=${email}`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.exists) {
          // The user already exists -> ask for password to login
          setExistingUser(true);
        } else {
          // The user doesn't exist -> send OTP and redirect to OTP page
          await fetch(`http://localhost:8080/api/sendOtp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone, email }),
          });
          navigate(`/otp-verification?phone=${phone}&email=${email}`);
        }
      } else {
        setError('Error checking user existence.');
      }
    } catch (err) {
      setError('Error: ' + err.message);
    }
  };

  // Step 2: If user exists, login with password
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`http://localhost:8080/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, email, password }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // If login is successful, store user info in context
          login(data.user);
          navigate('/dashboard');
        } else {
          setError(data.message || 'Login failed');
        }
      } else {
        setError('Error logging in.');
      }
    } catch (err) {
      setError('Error: ' + err.message);
    }
  };

  return (
    <div className='login-register-page'>
        <div className='logo-icon'></div>
        <div className="login-register-container">
        <h1>Login / Register</h1>
        <form onSubmit={existingUser ? handleLogin : handleCheckUser}>
            <div className="form-group">
            <label>Phone Number:</label>
            <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
            />
            </div>

            <div className="form-group">
            <label>Email Address:</label>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            </div>

            {existingUser && (
            <div className="form-group">
                <label>Password:</label>
                <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                />
            </div>
            )}

            {error && <p className="error-message">{error}</p>}

            <button type="submit">
            {existingUser ? 'Login' : 'Next'}
            </button>
        </form>
        </div>
    </div>
  );
};

export default LoginRegister;