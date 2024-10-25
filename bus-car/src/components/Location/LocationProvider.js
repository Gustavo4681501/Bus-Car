import React, { createContext, useContext, useEffect, useState } from 'react';
import { SessionContext } from '../../Auth/Authentication/SessionContext';
import { fetchLocationByUserId, createLocation, removeLocationByUserId, updateLocation } from '../../../api/locationApi';
import { fetchRoutes } from '../../../api/routeApi';
import useUserLocation from '../../Location/useUserLocation';

// Crear el contexto
export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const { currUser } = useContext(SessionContext);
  const userLocation = useUserLocation();
  const [location, setLocation] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch user location and routes
  useEffect(() => {
    const loadLocationAndRoutes = async () => {
      if (!currUser) return setLoading(false);

      try {
        const [routesData, locationData] = await Promise.all([
          fetchRoutes(),
          fetchLocationByUserId(currUser.sub)
        ]);
        setRoutes(routesData);
        setLocation(locationData);
        setSelectedRoute(locationData?.route_id || '');
      } catch (error) {
        console.error(error);
        setLocation(null);
      } finally {
        setLoading(false);
      }
    };

    loadLocationAndRoutes();
  }, [currUser]);

  // Update location if it changes
  useEffect(() => {
    const updateLocationIfChanged = async () => {
      if (!currUser || !userLocation || !location) return;

      const hasLocationChanged = location.latitude !== userLocation.lat || location.longitude !== userLocation.lng;
      if (hasLocationChanged) {
        try {
          const updatedLocation = await updateLocation(currUser.sub, {
            latitude: userLocation.lat,
            longitude: userLocation.lng,
          });
          setLocation(updatedLocation);
        } catch (error) {
          console.error(error);
        }
      }
    };

    updateLocationIfChanged();
  }, [currUser, userLocation, location]);

  // Funciones compartidas
  const handleAddLocation = async () => {
    if (!userLocation || !currUser) return;

    try {
      const newLocation = await createLocation({
        user_id: currUser.sub,
        latitude: userLocation.lat,
        longitude: userLocation.lng,
      });
      setLocation(newLocation);

      if (selectedRoute) {
        const updatedLocation = await updateLocation(currUser.sub, { ...newLocation, route_id: selectedRoute });
        setLocation(updatedLocation);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveLocation = async () => {
    if (!currUser?.sub) return;

    try {
      await removeLocationByUserId(currUser.sub);
      setLocation(null);
      setSelectedRoute('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectRoute = async (event) => {
    const routeId = event.target.value;
    setSelectedRoute(routeId);

    if (location && currUser) {
      try {
        const updatedLocation = await updateLocation(currUser.sub, { ...location, route_id: routeId });
        setLocation(updatedLocation);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleRemoveRoute = async () => {
    if (location && currUser) {
      try {
        const updatedLocation = await updateLocation(currUser.sub, { ...location, route_id: null });
        setLocation(updatedLocation);
        setSelectedRoute('');
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <LocationContext.Provider
      value={{
        location,
        routes,
        selectedRoute,
        loading,
        handleAddLocation,
        handleRemoveLocation,
        handleSelectRoute,
        handleRemoveRoute,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

// Custom hook to use location context
export const useLocationContext = () => {
  return useContext(LocationContext);
};
