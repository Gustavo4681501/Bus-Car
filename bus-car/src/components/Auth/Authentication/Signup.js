import React, { useRef } from 'react';
import { useContext } from 'react';
import { SessionContext } from './SessionContext'; // Importar el contexto
import { jwtDecode } from "jwt-decode";
import { signupUser } from '../../../api/authApi'; // Importar la función de autenticación

const Signup = ({ setShow }) => {
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
      const token = await signupUser(userInfo);
      
      // Decodifica el token y actualiza el estado del contexto
      const decodedToken = jwtDecode(token);
      setCurrUser(decodedToken);

      // Opcional: Redirigir o hacer algo después del registro exitoso
    } catch (error) {
      console.log('Error during signup:', error);
    }

    e.target.reset();
  };

  const handleClick = (e) => {
    e.preventDefault();
    setShow(true);
  };

  return (
    <div>
      <form ref={formRef} onSubmit={handleSubmit}>
        Email: <input type="email" name="email" placeholder="email" />
        <br />
        Password: <input type="password" name="password" placeholder="password" />
        <br />
        <input type="submit" value="Submit" />
      </form>
      <br />
      <div>
        Already registered, <a href="#login" onClick={handleClick}>Login</a> here.
      </div>
    </div>
  );
};

export default Signup;
