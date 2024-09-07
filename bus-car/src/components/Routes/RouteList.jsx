import React, { useState, useEffect } from 'react';

function RouteList({ onSelectRoute }) {
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/routes')
      .then(response => response.json())
      .then(data => setRoutes(data))
      .catch(error => console.error('Error fetching routes:', error));
  }, []);

  return (
    <ul>
      {routes.map(route => (
        <li key={route.id}>
          <button onClick={() => onSelectRoute(route)}>
            {route.name}
          </button>
        </li>
      ))}
    </ul>
  );
}

export default RouteList;
