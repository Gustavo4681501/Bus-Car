import React, { useRef, useContext } from 'react';
import { SessionContext } from './SessionContext'; // Importar el contexto
import { jwtDecode } from 'jwt-decode';
import { loginUser } from '../../../api/authApi'; // Importar la función de autenticación

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
    <div>
      <form ref={formRef} onSubmit={handleSubmit}>
        Email: <input type="email" name="email" placeholder="email" />
        <br />
        Password: <input type="password" name="password" placeholder="password" />
        <br />
        <input type="submit" value="Login" />
      </form>
      <br />
      <div>
        Not registered yet, <a href="#signup" onClick={handleClick}>Signup</a>
      </div>
      <div>
        Forgot your password, <a href="ResetPassword">Reset Password</a>
      </div>
    </div>
  );
};

export default Login;
