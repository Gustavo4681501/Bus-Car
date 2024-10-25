import React from 'react';
import { logoutUser } from '../../../api/authApi'; // Importar la función de autenticación
import './Logout.css'; // Asegúrate de importar el CSS

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
    <div className="logout-container">
      <input
        type="button"
        value="Cerrar sesión"
        onClick={handleClick}
        className="logout-button"
      />
    </div>
  );
};

export default Logout;
