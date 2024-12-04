import axios from 'axios';

// Base URL de la API
const BASE_URL = 'http://localhost:3000/api';

// ---------------------FETCH ALL LOCATIONS--------------------------------
/**
 * Obtiene todas las ubicaciones del servidor.
 * @returns {Promise<Array>} - Lista de ubicaciones.
 * @throws {Error} - Error en caso de fallo en la solicitud.
 */
export const fetchLocations = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/locations`);
    return response.data;
  } catch (error) {
    console.error('Error fetching locations:', error.message);
    // Devuelve un array vacío para evitar errores en el frontend
    return [];
  }
};

// ---------------------FETCH LOCATION BY USER ID--------------------------------
/**
 * Obtiene una ubicación específica según el ID del usuario.
 * @param {number|string} userId - ID del usuario.
 * @returns {Promise<Object>} - Detalles de la ubicación.
 * @throws {Error} - Error en caso de fallo en la solicitud.
 */
export const fetchLocationByUserId = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/locations/user/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'An error occurred while fetching the location');
  }
};


// ---------------------FETCH LOCATIONS BY ROUTE ID--------------------------------
/**
 * Obtiene ubicaciones específicas según el ID de la ruta.
 * @param {number|string} routeId - ID de la ruta.
 * @returns {Promise<Array>} - Lista de ubicaciones.
 * @throws {Error} - Error en caso de fallo en la solicitud.
 */
export const fetchLocationsByRouteId = async (routeId) => {
  try {
    const response = await axios.get(`${BASE_URL}/locations/route/${routeId}`);
    return response.data; // Si no hay ubicaciones, esto será un array vacío
  } catch (error) {
    // Solo lanzar error si hay un problema con la solicitud
    if (error.response?.status !== 404) {
      throw new Error(error.response?.data?.error || 'An error occurred while fetching locations for the route');
    }
    return []; // Retorna un array vacío si no se encuentran ubicaciones
  }
};


// ---------------------CREATE NEW LOCATION--------------------------------
/**
 * Crea una nueva ubicación en el servidor.
 * @param {Object} locationData - Datos de la nueva ubicación.
 * @returns {Promise<Object>} - La ubicación creada.
 * @throws {Error} - Error en caso de fallo en la solicitud.
 */
export const createLocation = async (locationData) => {
  try {
    const response = await axios.post(`${BASE_URL}/locations`, { location: locationData });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'An error occurred while creating the location');
  }
};

// ---------------------REMOVE LOCATION BY USER ID--------------------------------
/**
 * Elimina una ubicación específica según el ID del usuario.
 * @param {number|string} userId - ID del usuario.
 * @returns {Promise<void>} - No devuelve nada si se elimina correctamente.
 * @throws {Error} - Error en caso de fallo en la solicitud.
 */
export const removeLocationByUserId = async (userId) => {
  try {
    await axios.delete(`${BASE_URL}/locations/user/${userId}`);
  } catch (error) {
    throw new Error(error.response?.data?.error || 'An error occurred while removing the location');
  }
};

// ---------------------UPDATE LOCATION--------------------------------
/**
 * Actualiza una ubicación existente para un usuario específico.
 * @param {number|string} userId - ID del usuario.
 * @param {Object} locationData - Nuevos datos de la ubicación.
 * @returns {Promise<Object>} - La ubicación actualizada.
 * @throws {Error} - Error en caso de fallo en la solicitud.
 */
export const updateLocation = async (userId, locationData) => {
  try {
    const response = await axios.put(`${BASE_URL}/locations/user/${userId}`, { location: locationData });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'An error occurred while updating the location');
  }
};
