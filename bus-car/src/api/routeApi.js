// src/api/routeApi.js

export const saveRoute = (points) => {
  if (!Array.isArray(points)) {
    console.error('Expected points to be an array:', points);
    throw new Error('Points is not an array');
  }

  const waypoints = points.map(p => ({ lat: p.lat, lng: p.lng }));

  return fetch('http://localhost:3000/api/routes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ route: { name: 'New Route', waypoints: JSON.stringify(waypoints) } }),
  })
  .then(response => response.json())
  .catch(error => {
    console.error('Error creating route:', error);
    throw error;
  });
};


  // src/api/routeApi.js

export const fetchRoutes = () => {
    return fetch('http://localhost:3000/api/routes')
      .then(response => response.json())
      .catch(error => {
        console.error('Error fetching routes:', error);
        throw error;
      });
  };
  
  
  // src/api/routeApi.js

export const fetchRouteDetails = (routeId) => {
    return fetch(`http://localhost:3000/api/routes/${routeId}`)
      .then(response => response.json())
      .catch(error => {
        console.error('Error fetching route details:', error);
        throw error;
      });
  };
  

// src/api/routeApi.js

export const addLocationToRoute = (locationId, routeId) => {
  return fetch(`http://localhost:3000/api/locations/${locationId}/add_route`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ route_id: routeId }),
  })
  .then(response => response.json())
  .catch(error => {
      console.error('Error adding location to route:', error);
      throw error;
  });
};

export const removeLocationFromRoute = (locationId, routeId) => {
  return fetch(`http://localhost:3000/api/locations/${locationId}/remove_route`, {
      method: 'DELETE',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ route_id: routeId }),
  })
  .then(response => response.json())
  .catch(error => {
      console.error('Error removing location from route:', error);
      throw error;
  });
};
