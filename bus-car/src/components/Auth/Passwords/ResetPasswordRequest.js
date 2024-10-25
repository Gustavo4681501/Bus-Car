import React, { useState } from 'react';
import './ResetPasswordRequest.css'; // Asegúrate de importar el CSS

const ResetPasswordRequest = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/forgot_password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setError('');
      } else {
        setError(data.error);
        setMessage('');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      setMessage('');
    }
  };

  return (
    <div className="reset-password-container">
      <h2 className="reset-password-title">¿Olvidaste tu Contraseña?</h2>
      <form className="reset-password-form" onSubmit={handleSubmit}>
        <label htmlFor="email" className="reset-password-label">Ingresa tu correo electrónico:</label>

        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="reset-password-input"
          placeholder="ejemplo@ejemplo.com"
        />
        <button type="submit" className="reset-password-button">Enviar correo de restablecimiento</button>
      </form>
      {message && <p className="reset-password-message success">{message}</p>}
      {error && <p className="reset-password-message error">{error}</p>}
    </div>
  );
};

export default ResetPasswordRequest;
