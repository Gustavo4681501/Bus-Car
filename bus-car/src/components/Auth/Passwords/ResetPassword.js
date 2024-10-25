import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ResetPassword.css'; // Asegúrate de agregar un archivo de estilo CSS

const ResetPassword = () => {
  const { reset_password_token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: {
            password: password,
            password_confirmation: confirmPassword,
            reset_password_token: reset_password_token
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to reset password');
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="reset-password-container">
      <h2 className="reset-password-title">Reset Your Password</h2>
      {success ? (
        <p className="reset-password-success">Password reset successfully! Redirecting to home...</p>
      ) : (
        <form className="reset-password-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="password" className="reset-password-label">New Password:</label>
            <input
              type="password"
              id="password"
              className="reset-password-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter new password"
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword" className="reset-password-label">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              className="reset-password-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm new password"
            />
          </div>
          {error && <p className="reset-password-error">{error}</p>}
          <button type="submit" className="reset-password-button">Reset Password</button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
