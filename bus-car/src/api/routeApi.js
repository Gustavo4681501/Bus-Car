// src/api/routeApi.js

import axios from 'axios';

const API_URL = 'http://localhost:3000/api/routes';

/**  
 * --------------------POST------------------------------
 * Guarda una nueva ruta en el api.
 * @param {Object} route - La ruta a guardar.
 * @returns {Promise<Object>} - La ruta creada.
 */
export const saveRoute = async (route) => {
  const { name, origin, destination, via_waypoints, bus_stops } = route;

  try {
    const response = await axios.post(API_URL, {
      route: {
        name: name || 'New Route',
        origin: JSON.stringify(origin),
        destination: JSON.stringify(destination),
        via_waypoints: JSON.stringify(via_waypoints),
        bus_stops: JSON.stringify(bus_stops),
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating route:', error);
    throw error.response ? error.response.data : error.message;
  }
};

/**
 * ---------------------GET---------------------------------
 * Recupera todas las rutas del servidor.
 * @returns {Promise<Array>} - Lista de rutas.
 */
export const fetchRoutes = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching routes:', error);
    throw error.response ? error.response.data : error.message;
  }
};

/**
 * ---------------------UPDATE ROUTE BY ID--------------------------------
 * Actualiza una ruta existente.
 * @param {number|string} routeId - ID de la ruta a actualizar.
 * @param {Object} updatedRoute - Los nuevos datos de la ruta.
 * @returns {Promise<Object>} - La ruta actualizada.
 */
export const updateRoute = async (routeId, updatedRoute) => {
  const { name, origin, destination, via_waypoints, bus_stops } = updatedRoute;

  try {
    const response = await axios.put(`${API_URL}/${routeId}`, {
      route: {
        name: name || 'Updated Route',
        origin: JSON.stringify(origin),
        destination: JSON.stringify(destination),
        via_waypoints: JSON.stringify(via_waypoints),
        bus_stops: JSON.stringify(bus_stops),
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating route:', error);
    throw error.response ? error.response.data : error.message;
  }
};

/**
 * ---------------------DESTROY ROUTE BY ID--------------------------------
 * Elimina una ruta por su ID.
 * @param {number|string} routeId - ID de la ruta a eliminar.
 * @returns {Promise<Object>} - La respuesta del servidor.
 */
export const deleteRoute = async (routeId) => {
  try {
    const response = await axios.delete(`${API_URL}/${routeId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting route:', error);
    throw error.response ? error.response.data : error.message;
  }
};


/**
 * -----------------------GET BY ID-----------------------------
 * Recupera los detalles de una ruta específica por su ID.
 * @param {number|string} routeId - ID de la ruta a recuperar.
 * @returns {Promise<Object>} - Detalles de la ruta.
 */
export const fetchRouteById = async (routeId) => {
  try {
    const response = await axios.get(`${API_URL}/${routeId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching route details:', error);
    throw error.response ? error.response.data : error.message;
  }
};

/**
 * --------------------POST LOCATION TO ROUTE-----------------------
 * Añade una ubicación a una ruta existente.
 * @param {number|string} locationId - ID de la ubicación.
 * @param {number|string} routeId - ID de la ruta.
 * @returns {Promise<Object>} - La respuesta del servidor.
 */
export const addLocationToRoute = async (locationId, routeId) => {
  try {
    const response = await axios.post(`http://localhost:3000/api/locations/${locationId}/add_route`, {
      route_id: routeId,
    });
    return response.data;
  } catch (error) {
    console.error('Error adding location to route:', error);
    throw error.response ? error.response.data : error.message;
  }
};

/**
 * ---------------------DESTROY LOCATION TO ROUTE--------------------------------
 * Elimina una ubicación de una ruta existente.
 * @param {number|string} locationId - ID de la ubicación.
 * @param {number|string} routeId - ID de la ruta.
 * @returns {Promise<Object>} - La respuesta del servidor.
 */
export const removeLocationFromRoute = async (locationId, routeId) => {
  try {
    const response = await axios.delete(`http://localhost:3000/api/locations/${locationId}/remove_route`, {
      data: { route_id: routeId },
    });
    return response.data;
  } catch (error) {
    console.error('Error removing location from route:', error);
    throw error.response ? error.response.data : error.message;
  }
};

