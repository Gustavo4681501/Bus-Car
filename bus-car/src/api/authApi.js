import axios from 'axios';

// URL base de la API
const API_URL = 'http://localhost:3000';

// ---------------------LOGIN USER--------------------------------
/**
 * Autentica al usuario con las credenciales proporcionadas.
 * @param {Object} userInfo - Información del usuario (correo, contraseña, etc.).
 * @returns {Promise<string>} - Token de autenticación.
 * @throws {Error} - Error en caso de fallo en la solicitud o credenciales incorrectas.
 */
export const loginUser = async (userInfo) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userInfo);

    const token = response.headers['authorization'];
    localStorage.setItem('token', token);

    return token;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'An error occurred while logging in');
  }
};

// ---------------------LOGOUT USER--------------------------------
/**
 * Cierra la sesión del usuario autenticado.
 * @returns {Promise<void>} - Promesa vacía si el cierre de sesión es exitoso.
 * @throws {Error} - Error en caso de fallo en la solicitud.
 */
export const logoutUser = async () => {
  try {
    const token = localStorage.getItem('token');
    await axios.delete(`${API_URL}/logout`, {
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
    });

    localStorage.removeItem('token');
  } catch (error) {
    throw new Error(error.response?.data?.error || 'An error occurred while logging out');
  }
};

// ---------------------SIGNUP USER--------------------------------
/**
 * Registra a un nuevo usuario en el sistema.
 * @param {Object} userInfo - Información del nuevo usuario (nombre, correo, contraseña, etc.).
 * @returns {Promise<string>} - Token de autenticación.
 * @throws {Error} - Error en caso de fallo en la solicitud o si los datos son incorrectos.
 */
export const signupUser = async (userInfo) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, userInfo);

    const token = response.headers['authorization'];
    localStorage.setItem('token', token);

    return token;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'An error occurred while signing up');
  }
};
