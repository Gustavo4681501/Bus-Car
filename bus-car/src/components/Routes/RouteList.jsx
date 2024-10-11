import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importar estilos de Bootstrap
import './RouteList.css'; // Importar estilos personalizados
import { fetchRoutes, deleteRoute } from '../../api/routeApi'; // Importa la función fetchRoutes y deleteRoute

function RouteList() {
  const [routes, setRoutes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRoutes()
      .then(data => setRoutes(data))
      .catch(error => console.error('Error fetching routes:', error));
  }, []);

  const handleRouteClick = (route) => {
    navigate(`/route/${route.id}`); // Navegar a la vista de la ruta
  };

  const handleEditRoute = (route) => {
    navigate(`/edit-route/${route.id}`); // Navegar a la vista de edición de la ruta
  };

  const handleDeleteRoute = (routeId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta ruta?')) {
      deleteRoute(routeId)
        .then(() => {
          // Actualiza la lista de rutas después de eliminar
          setRoutes(routes.filter(route => route.id !== routeId));
        })
        .catch(error => console.error('Error deleting route:', error));
    }
  };

  return (
    <div className="container route-list-container">
      <div className="route-list-wrapper">
        {routes.slice().reverse().map(route => (  // Invertir el array
          <div className="route-item" key={route.id}>
            <button onClick={() => handleRouteClick(route)}>
              Ver Ruta {route.id}
            </button>
            <button onClick={() => handleEditRoute(route)}>
              Editar Ruta {route.id}
            </button>
            <button onClick={() => handleDeleteRoute(route.id)} style={{ color: 'red' }}>
              Eliminar Ruta {route.id}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RouteList;
