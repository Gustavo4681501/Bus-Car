import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importar estilos de Bootstrap
import './RouteList.css'; // Importar estilos personalizados
import { fetchRoutes } from '../../api/routeApi'; // Importa la función fetchRoutes

function RouteList() {
  const [routes, setRoutes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRoutes()
      .then(data => setRoutes(data))
      .catch(error => console.error('Error fetching routes:', error));
  }, []);

  const handleRouteClick = (route) => {
    navigate(`/route/${route.id}`);
  };

  return (
    <div className="container route-list-container">
      <div className="route-list-wrapper">
        {routes.slice().reverse().map(route => (  // Invertir el array
          <div className="route-item" key={route.id}>
            <button className="btn btn-primary w-100 h-100" onClick={() => handleRouteClick(route)}>
              {route.id}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RouteList;
