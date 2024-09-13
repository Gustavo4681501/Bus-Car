import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

// Crear el contexto
export const SessionContext = createContext();

// Crear el proveedor del contexto
export const SessionProvider = ({ children }) => {
  const [currUser, setCurrUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setCurrUser(decodedToken);
      } catch (error) {
        console.log('Invalid token:', error);
        localStorage.removeItem('token');
      }
    }
  }, []);

  return (
    <SessionContext.Provider value={{ currUser, setCurrUser }}>
      {children}
    </SessionContext.Provider>
  );
};
