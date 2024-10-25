import React, { useContext, useEffect, useState } from 'react'; 
import { SessionContext } from '../../Auth/Authentication/SessionContext';
import { fetchLocationByUserId, createLocation, removeLocationByUserId, updateLocation } from '../../../api/locationApi';
import { fetchRoutes } from '../../../api/routeApi';
import useUserLocation from '../../Location/useUserLocation'; // Importa tu hook personalizado
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa Bootstrap

const LocationManager = () => {
  const userLocation = useUserLocation(); // Hook personalizado para obtener la ubicación
  const { currUser } = useContext(SessionContext);
  const [location, setLocation] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currUser) {
      fetchRoutes()
        .then(setRoutes)
        .catch(console.error);

      fetchLocationByUserId(currUser.sub)
        .then(locationData => {
          setLocation(locationData);
          if (locationData?.route_id) {
            setSelectedRoute(locationData.route_id);
          } else {
            setSelectedRoute('');
          }
        })
        .catch(() => setLocation(null))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [currUser]);

  //este debe ser el que envia la location al api hacer global
  useEffect(() => {
    if (currUser && userLocation) {
      if (!location || location.latitude !== userLocation.lat || location.longitude !== userLocation.lng) {
        updateLocation(currUser.sub, {
          latitude: userLocation.lat,
          longitude: userLocation.lng
        }).then(updatedLocation => {
          setLocation(updatedLocation);
        })
          .catch(console.error);
      }
    }
  }, [currUser, userLocation]);

  const handleAddLocation = () => {
    if (userLocation && currUser) {
      createLocation({
        user_id: currUser.sub,
        latitude: userLocation.lat,
        longitude: userLocation.lng
      })
        .then(newLocation => {
          setLocation(newLocation);
          if (selectedRoute) {
            return updateLocation(currUser.sub, { ...newLocation, route_id: selectedRoute });
          }
          return newLocation;
        })
        .then(updatedLocation => {
          setLocation(updatedLocation);
        })
        .catch(console.error);
    }
  };

  const handleRemoveLocation = () => {
    if (currUser?.sub) {
      removeLocationByUserId(currUser.sub)
        .then(() => {
          setLocation(null);
          setSelectedRoute('');
        })
        .catch(console.error);
    }
  };

  const handleSelectRoute = (event) => {
    const routeId = event.target.value;
    setSelectedRoute(routeId);

    if (location && routeId && currUser) {
      const { id, created_at, updated_at, ...locationData } = location;
      updateLocation(currUser.sub, { ...locationData, route_id: routeId })
        .then(updatedLocation => {
          setLocation(updatedLocation);
        })
        .catch(console.error);
    }
  };

  const handleRemoveRoute = () => {
    if (location && currUser) {
      const { id, created_at, updated_at, ...locationData } = location;
      updateLocation(currUser.sub, { ...locationData, route_id: null })
        .then(updatedLocation => {
          setLocation(updatedLocation);
          setSelectedRoute('');
        })
        .catch(console.error);
    }
  };

  if (loading) {
    return <div className="text-center">cargando...</div>;
  }

  if (!currUser) {
    return <div className="text-center">Log in.</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Ubicaciones</h2>
      {userLocation && !location ? (
        <div className="text-center">
          <button className="btn btn-primary" onClick={handleAddLocation}>Añadir  ubicación</button>

        </div>
      ) : location ? (
        <div className="card p-4">
          <div className="d-flex justify-content-between">
            <button className="btn btn-danger" onClick={handleRemoveLocation}>Eliminar ubicación</button>
            <h3>Ubicacion actual</h3>
          </div>
          {routes.length > 0 && (
            <div className="mt-3">
              <h3>Seleccionar Ruta</h3>
              <select
                className="form-select"
                value={selectedRoute}
                onChange={handleSelectRoute}
              >
                <option value="">Seleccionar</option>
                {routes.map(route => (
                  <option key={route.id} value={route.id}>
                    {route.name} {/* Muestra el nombre de la ruta */}
                  </option>
                ))}
              </select>
              {selectedRoute && (
                <button className="btn btn-warning mt-2" onClick={handleRemoveRoute}>Quitar mi ubicacion de la ruta</button>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center">Ubicacion no disponible</div>
      )}
    </div>
  );
};

export default LocationManager;
