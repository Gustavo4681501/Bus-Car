import React, { useRef, useContext, useState } from "react";
import { SessionContext } from "./SessionContext"; // Importar el contexto
import { jwtDecode } from "jwt-decode";
import { loginUser } from "../../../api/authApi"; // Importar la función de autenticación
import "./Login.css"; // Asegúrate de importar el CSS

const Login = ({ setShow }) => {
  const formRef = useRef();
  const { setCurrUser } = useContext(SessionContext); // Acceder al contexto
  const [error, setError] = useState(null); // Estado para el mensaje de error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Resetea el error al intentar iniciar sesión nuevamente
    const formData = new FormData(formRef.current);
    const data = Object.fromEntries(formData);
    const userInfo = {
      user: { email: data.email, password: data.password },
    };

    try {
      const token = await loginUser(userInfo);
      const decodedToken = jwtDecode(token);
      setCurrUser(decodedToken);
    } catch (error) {
      console.error("Error logging in:", error);
      setError(
        "Hubo un problema al iniciar sesión. Por favor, revisa tus credenciales."
      );
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
        {/* Mostrar el mensaje de error si existe */}
      {error && <p className="error-message">{error}</p>} 
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            placeholder="Ingrese su email"
            required
          />
        </div>
        <div className="form-group">
          <label>Contraseña:</label>
          <input
            type="password"
            name="password"
            placeholder="Ingrese su contraseña"
            required
          />
        </div>
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
      <div className="login-footer">
        <div>
          ¿No estás registrado?{" "}
          <a href="#signup" onClick={handleClick}>
            Regístrate
          </a>
        </div>
        <div>
          ¿Olvidaste tu contraseña?{" "}
          <a href="ResetPassword">Restablecer contraseña</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
