import React, { useState, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/createPassword.css';

const CreatePassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const phone = searchParams.get('phone');
  const email = searchParams.get('email');

  const { login } = useContext(AuthContext);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, email, password }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Registration success -> log them in and go to dashboard
          login(data.user);
          navigate('/dashboard');
        } else {
          setError(data.message || 'Registration failed');
        }
      } else {
        setError('Error creating account.');
      }
    } catch (err) {
      setError('Error: ' + err.message);
    }
  };

  return (
    <div className="create-password-container">
      <h1>Create Your Password</h1>
      <form onSubmit={handleCreateAccount}>
        <div className="form-group">
          <label>New Password (at least 5 characters):</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={5}
            required
          />
        </div>

        <div className="form-group">
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            minLength={5}
            required
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit">Create Account</button>
      </form>
    </div>
  );
};

export default CreatePassword;
