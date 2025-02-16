import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../styles/otpVerification.css';

const OtpVerification = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const phone = searchParams.get('phone');
  const email = searchParams.get('email');

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`http://localhost:8080/api/verifyOtp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, email, otp }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // OTP verified -> go to password creation
          navigate(`/create-password?phone=${phone}&email=${email}`);
        } else {
          setError(data.message || 'Invalid OTP');
        }
      } else {
        setError('Error verifying OTP.');
      }
    } catch (err) {
      setError('Error: ' + err.message);
    }
  };

  return (
    <div className="otp-verification-container">
      <h1>OTP Verification</h1>
      <form onSubmit={handleVerifyOtp}>
        <div className="form-group">
          <label>Enter OTP:</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit">Verify OTP</button>
      </form>
    </div>
  );
};

export default OtpVerification;