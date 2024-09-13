import React from 'react';
import { logoutUser } from '../../../api/authApi'; // Importar la función de autenticación

const Logout = ({ setCurrUser }) => {
  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await logoutUser();
      setCurrUser(null);
    } catch (error) {
      console.log('Error logging out:', error);
    }
  };

  return (
    <div>
      <input type="button" value="Logout" onClick={handleClick} />
    </div>
  );
};

export default Logout;
