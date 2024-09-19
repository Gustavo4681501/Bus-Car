import React, { useContext, useEffect, useState } from 'react';
import { UserLocationContext } from '../../Location/UserLocationContext';
import { SessionContext } from '../../Auth/Authentication/SessionContext';
import { fetchLocationByUserId, createLocation, removeLocationByUserId, updateLocation } from '../../../api/locationApi';
import { fetchRoutes } from '../../../api/routeApi';

const LocationManager = () => {
  const { userLocation } = useContext(UserLocationContext);
  const { currUser } = useContext(SessionContext);
  const [location, setLocation] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currUser) {
      // Fetch routes
      fetchRoutes()
        .then(setRoutes)
        .catch(console.error);

      // Fetch location for the current user
      fetchLocationByUserId(currUser.sub)
        .then(setLocation)
        .catch(() => setLocation(null)) // Handle case where location is not found
        .finally(() => setLoading(false));
    }
  }, [currUser]);

  const handleAddLocation = () => {
    if (userLocation) {
      createLocation({
        user_id: currUser.sub,
        latitude: userLocation.lat,
        longitude: userLocation.lng
      })
        .then(newLocation => {
          setLocation(newLocation);
        })
        .catch(console.error);
    }
  };

  const handleRemoveLocation = () => {
    if (currUser.sub) {
      removeLocationByUserId(currUser.sub)
        .then(() => {
          setLocation(null);
        })
        .catch(console.error);
    }
  };

  const handleSelectRoute = (event) => {
    const routeId = event.target.value;
    const selected = routes.find(route => route.id === routeId);
    setSelectedRoute(selected);

    if (location && routeId) {
      // Exclude unnecessary fields before updating the location
      const { id, created_at, updated_at, ...locationData } = location;
      
      // Update the location with the selected route
      updateLocation(currUser.sub, { ...locationData, route_id: routeId })
        .then(updatedLocation => {
          setLocation(updatedLocation);
        })
        .catch(console.error);
    }
  };

  const handleRemoveRoute = () => {
    if (location && selectedRoute) {
      // Exclude unnecessary fields before updating the location
      const { id, created_at, updated_at, ...locationData } = location;

      updateLocation(currUser.sub, { ...locationData, route_id: null })
        .then(updatedLocation => {
          setLocation(updatedLocation);
          setSelectedRoute(null);
        })
        .catch(console.error);
    }
  };

  

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Location Manager</h2>
      {userLocation && !location ? (
        <button onClick={handleAddLocation}>Add Location</button>
      ) : location ? (
        <div>
          <button onClick={handleRemoveLocation}>Remove Location</button>
          {routes.length > 0 && (
            <div>
              <h3>Select Route</h3>
              <select
                value={selectedRoute ? selectedRoute.id : ''}
                onChange={handleSelectRoute}
              >
                <option value="">Select a route</option>
                {routes.map(route => (
                  <option key={route.id} value={route.id}>
                    {route.id}
                  </option>
                ))}
              </select>
              {selectedRoute && (
                <button onClick={handleRemoveRoute}>Remove Route from Location</button>
              )}
            </div>
          )}
        </div>
      ) : (
        <div>No location available</div>
      )}
    </div>
  );
};

export default LocationManager;
