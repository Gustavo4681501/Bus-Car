import React, { useRef, useContext, useState } from 'react';
import { SessionContext } from './SessionContext'; // Importar el contexto
import { jwtDecode } from "jwt-decode";
import { signupUser } from '../../../api/authApi'; // Importar la función de autenticación
import './Signup.css'; // Asegúrate de importar el CSS

const Signup = ({ setShow }) => {
  const formRef = useRef();
  const { setCurrUser } = useContext(SessionContext); // Acceder al contexto
  const [error, setError] = useState(null); // Estado para el mensaje de error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Resetea el error al intentar registrarse nuevamente
    const formData = new FormData(formRef.current);
    const data = Object.fromEntries(formData);
    const userInfo = {
      user: { email: data.email, password: data.password },
    };

    try {
      const token = await signupUser(userInfo);
      const decodedToken = jwtDecode(token);
      setCurrUser(decodedToken);
      // Opcional: Redirigir o hacer algo después del registro exitoso
    } catch (error) {
      console.error('Error during signup:', error);
      setError("Hubo un problema al registrarte. Por favor, revisa tus credenciales.");
    }

    e.target.reset();
  };

  const handleClick = (e) => {
    e.preventDefault();
    setShow(true);
  };

  return (
    <div className="signup-container">
      <form ref={formRef} onSubmit={handleSubmit} className="signup-form">
        <h2>Registro</h2>
        {/* Mostrar el mensaje de error si existe */}
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <label>Email:</label>
          <input type="email" name="email" placeholder="Ingrese su email" required />
        </div>
        <div className="form-group">
          <label>Contraseña:</label>
          <input type="password" name="password" placeholder="Ingrese su contraseña" required />
        </div>
        <button type="submit" className="signup-button">Registrar</button>
      </form>
      <div className="signup-footer">
        <div>
          ¿Ya estás registrado? <a href="#login" onClick={handleClick}>Iniciar sesión</a> aquí.
        </div>
      </div>
    </div>
  );
};

export default Signup;
