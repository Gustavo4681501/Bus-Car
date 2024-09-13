import React, { useEffect, useState, useRef, useContext } from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { useLocation } from 'react-router-dom';
import { SessionContext } from '../Auth/Authentication/SessionContext';
import { UserLocationContext } from '../Location/UserLocationContext'; // Asegúrate de que la ruta sea correcta
import { fetchLocations } from '../../api/locationApi'; // Importa la API de ubicaciones
import { getDirections } from '../../api/googleApi'; // Importa la API de Google Maps
import './Map.css';

const API_KEY = "AIzaSyC9daW8QnV6HJ6UoxwoKr16lcK08xMvrmY";

const containerStyle = {
  width: '100%',
  height: '100vh',
};

const blueMarkerIcon = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';

function Map() {
  const { userLocation, setUserLocation } = useContext(UserLocationContext); // Obtener desde el contexto
  const [locations, setLocations] = useState([]);
  const [directions, setDirections] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [isMapsLoaded, setIsMapsLoaded] = useState(false); // Estado para verificar carga de la API
  const mapRef = useRef();
  const prevUserLocationRef = useRef(null); // Referencia para la ubicación anterior
  const { state } = useLocation();
  const { currUser } = useContext(SessionContext);

  // Intentar obtener la ubicación con reintentos si falla
  const getUserLocation = (retries = 5) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newLocation = { lat: latitude, lng: longitude };

          // Actualizar la ubicación del contexto
          setUserLocation(newLocation);
          console.log('User location:', newLocation);

          // Evitar que el mapa parpadee si la ubicación no ha cambiado significativamente
          if (prevUserLocationRef.current && (
            Math.abs(prevUserLocationRef.current.lat - newLocation.lat) > 0.001 ||
            Math.abs(prevUserLocationRef.current.lng - newLocation.lng) > 0.001
          )) {
            // Solo actualizar el centro del mapa si la ubicación cambió significativamente
            if (mapRef.current && isMapsLoaded) {
              mapRef.current.panTo(newLocation); // Usar panTo para suavizar el movimiento
              mapRef.current.setZoom(14); // Asegura que el zoom esté correcto
            }
          }
          prevUserLocationRef.current = newLocation; // Actualizar la referencia
        },
        (error) => {
          console.error('Error getting location:', error);
          if (retries > 0) {
            // Reintentar después de 3 segundos si falla
            setTimeout(() => getUserLocation(retries - 1), 3000);
          }
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    }
  };

  // Actualiza la ubicación del usuario cada 10 segundos
  useEffect(() => {
    getUserLocation();
    const locationInterval = setInterval(() => {
      getUserLocation();
    }, 10000); // Actualiza cada 10 segundos

    return () => clearInterval(locationInterval);
  }, [isMapsLoaded]);

  // Fetch de ubicaciones de otros usuarios
  useEffect(() => {
    const updateLocations = async () => {
      const locationsData = await fetchLocations(); // Usar la función fetchLocations
      setLocations(locationsData);
    };

    updateLocations();
    const intervalId = setInterval(updateLocations, 5000); // Actualiza cada 5 segundos

    return () => clearInterval(intervalId);
  }, []);

  // Manejo de rutas seleccionadas
  useEffect(() => {
    if (state && state.destination) {
      setSelectedRoute({ waypoints: JSON.stringify([state.destination]) });
    }
  }, [state]);

  // Carga y renderización de direcciones
  useEffect(() => {
    const fetchDirections = async () => {
      if (selectedRoute && userLocation && isMapsLoaded) {
        try {
          const waypoints = JSON.parse(selectedRoute.waypoints).map(p => ({
            location: new window.google.maps.LatLng(p.lat, p.lng),
            stopover: false,
          }));
          const destination = waypoints.pop().location;

          const result = await getDirections(userLocation, destination, waypoints); // Usar la función getDirections
          setDirections(result);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchDirections();
  }, [selectedRoute, userLocation, isMapsLoaded]);

  // Manejador cuando el mapa carga
  const handleMapLoad = (mapInstance) => {
    mapRef.current = mapInstance;
    setIsMapsLoaded(true);
    if (userLocation) {
      mapInstance.setCenter(userLocation);
      mapInstance.setZoom(14);
    }
  };

  return (
    <div id="map-container">
      <LoadScript googleMapsApiKey={API_KEY} onLoad={() => setIsMapsLoaded(true)}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={userLocation || { lat: 0, lng: 0 }} // Asegúrate de que el mapa tenga un centro predeterminado
          zoom={14}
          onLoad={handleMapLoad}
          options={{
            mapTypeControl: false,
            streetViewControl: false,
          }}
        >
          {locations.map((loc) => (
            <Marker
              key={loc.user_id}
              position={{ lat: loc.latitude, lng: loc.longitude }}
              label={String(loc.user_id)}
            />
          ))}
          {userLocation && (
            <Marker
              position={userLocation}
              icon={blueMarkerIcon}
            />
          )}
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}

export default Map;
