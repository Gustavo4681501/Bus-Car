import React, { useRef } from 'react';
import { useContext } from 'react';
import { SessionContext } from './SessionContext'; // Importar el contexto
import { jwtDecode } from "jwt-decode";

const Signup = ({ setShow }) => {
  const formRef = useRef();
  const { setCurrUser } = useContext(SessionContext); // Acceder al contexto

  const signup = async (userInfo) => {
    const url = 'http://localhost:3000/signup';
    try {
      const response = await fetch(url, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(userInfo),
      });
      const data = await response.json();
      if (!response.ok) throw data.error;

      const token = response.headers.get('Authorization');
      localStorage.setItem('token', token);

      // Decodifica el token y actualiza el estado del contexto
      const decodedToken = jwtDecode(token);
      setCurrUser(decodedToken);
    } catch (error) {
      console.log('error', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(formRef.current);
    const data = Object.fromEntries(formData);
    const userInfo = {
      user: { email: data.email, password: data.password },
    };
    signup(userInfo);
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
