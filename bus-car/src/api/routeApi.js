// src/api/routeApi.js

export const saveRoute = (points) => {
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
  