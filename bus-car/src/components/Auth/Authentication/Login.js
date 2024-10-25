import React, { useRef, useContext } from 'react';
import { SessionContext } from './SessionContext'; // Importar el contexto
import { jwtDecode } from 'jwt-decode';
import { loginUser } from '../../../api/authApi'; // Importar la función de autenticación
import './Login.css'; // Asegúrate de importar el CSS

const Login = ({ setShow }) => {
  const formRef = useRef();
  const { setCurrUser } = useContext(SessionContext); // Acceder al contexto

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(formRef.current);
    const data = Object.fromEntries(formData);
    const userInfo = {
      user: { email: data.email, password: data.password },
    };

    try {
      const token = await loginUser(userInfo);
      // Decodifica el token y actualiza el estado del contexto
      const decodedToken = jwtDecode(token);
      setCurrUser(decodedToken);
    } catch (error) {
      console.log('Error logging in:', error);
    }

    e.target.reset();
  };

  const handleClick = (e) => {
    e.preventDefault();
    setShow(false);
  };

  return (
    <div className="login-container">
      <form ref={formRef} onSubmit={handleSubmit} className="login-form">
        <h2>Iniciar Sesión</h2>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" name="email" placeholder="Ingrese su email" required />
        </div>
        <div className="form-group">
          <label>Contraseña:</label>
          <input type="password" name="password" placeholder="Ingrese su contraseña" required />
        </div>
        <button type="submit" className="login-button">Login</button>
      </form>
      <div className="login-footer">
        <div>
          ¿No estás registrado? <a href="#signup" onClick={handleClick}>Regístrate</a>
        </div>
        <div>
          ¿Olvidaste tu contraseña? <a href="ResetPassword">Restablecer contraseña</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
