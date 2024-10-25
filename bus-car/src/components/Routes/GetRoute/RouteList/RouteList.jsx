import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./RouteList.css";
import { fetchRoutes, deleteRoute } from "../../../../api/routeApi";

function RouteList() {
  const [routes, setRoutes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const scrollRef = useRef(null); // Referencia para el scroll

  useEffect(() => {
    fetchRoutes()
      .then((data) => setRoutes(data))
      .catch((error) => console.error("Error fetching routes:", error));
  }, []);

  const handleRouteClick = (route) => {
    navigate(`/route/${route.id}`);
  };

  const handleEditRoute = (route) => {
    navigate(`/edit-route/${route.id}`);
  };

  const handleDeleteRoute = (routeId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta ruta?")) {
      deleteRoute(routeId)
        .then(() => {
          setRoutes(routes.filter((route) => route.id !== routeId));
        })
        .catch((error) => console.error("Error deleting route:", error));
    }
  };

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 200, behavior: "smooth" });
  };

  const filteredRoutes = routes.filter((route) =>
    route.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar ruta"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="container route-list-container">
        <div className="arrow left-arrow" onClick={scrollLeft}>
          &#9664;
        </div>
        <div className="route-list-wrapper" ref={scrollRef}>
          {filteredRoutes.length > 0 ? (
            filteredRoutes
              .slice()
              .reverse()
              .map((route) => (
                <div className="route-item" key={route.id}>
                  <div className="route-details">
                    <span className="route-name">{route.name}</span> -{" "}
                    <span className="route-author">
                      Creado por: {route.user_id}
                    </span>
                  </div>
                  <div className="route-actions">
                    <button onClick={() => handleRouteClick(route)}>
                      Ver Ruta
                    </button>
                    <button onClick={() => handleEditRoute(route)}>
                      Editar Ruta
                    </button>
                    <button
                      onClick={() => handleDeleteRoute(route.id)}
                      style={{ color: "red" }}
                    >
                      Eliminar Ruta
                    </button>
                  </div>
                </div>
              ))
          ) : (
            <p>No se encontraron rutas</p>
          )}
        </div>
        <div className="arrow right-arrow" onClick={scrollRight}>
          &#9654;
        </div>
      </div>
    </div>
  );
}

export default RouteList;
