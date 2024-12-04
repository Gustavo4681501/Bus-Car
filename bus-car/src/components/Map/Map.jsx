import React, { useEffect, useState, useRef } from 'react';
import { GoogleMap,  Marker, DirectionsRenderer } from '@react-google-maps/api';
import { useLocation } from 'react-router-dom';
import { fetchLocations } from '../../api/locationApi'; // Importa la API de ubicaciones
import { getDirections } from '../../api/googleApi'; // Importa la API de Google Maps
import useUserLocation from '../Location/useUserLocation'; // Importa el hook personalizado
import './Map.css';

const containerStyle = {
  width: '50vw',
  height: '80vh',
};

const blueMarkerIcon = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';

function Map() {
  const userLocation = useUserLocation(); // Usar el hook para obtener la ubicación del usuario
  const [locations, setLocations] = useState([]);
  const [directions, setDirections] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [isMapsLoaded, setIsMapsLoaded] = useState(false); // Estado para verificar carga de la API
  const mapRef = useRef();
  const { state } = useLocation();
  

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
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={userLocation ||{ lat: 9.945771786956337, lng: -84.19012069702148 }} // Asegúrate de que el mapa tenga un centro predeterminado
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
    </div>
  );
}

export default Map;
