import axios from 'axios';

// Base URL de la API
const BASE_URL = 'http://localhost:3000/api';

// Obtener todas las ubicaciones
export const fetchLocations = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/locations`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'An error occurred while fetching locations');
  }
};

// Obtener la ubicación por ID de usuario
export const fetchLocationByUserId = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/locations/user/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'An error occurred while fetching the location');
  }
};

// Crear una nueva ubicación
export const createLocation = async (locationData) => {
  try {
    const response = await axios.post(`${BASE_URL}/locations`, { location: locationData });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'An error occurred while creating the location');
  }
};

// Eliminar la ubicación por ID de usuario
export const removeLocationByUserId = async (userId) => {
  try {
    await axios.delete(`${BASE_URL}/locations/user/${userId}`);
  } catch (error) {
    throw new Error(error.response?.data?.error || 'An error occurred while removing the location');
  }
};

// Actualizar una ubicación existente
export const updateLocation = async (userId, locationData) => {
  try {
    const response = await axios.put(`${BASE_URL}/locations/user/${userId}`, { location: locationData });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'An error occurred while updating the location');
  }
};