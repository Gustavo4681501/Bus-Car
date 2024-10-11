import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GoogleMap, DirectionsRenderer, Marker } from '@react-google-maps/api';
import { fetchRouteById } from '../../api/routeApi';

const containerStyle = {
  width: '100%',
  height: '100vh',
};

// Función auxiliar para formatear los via_waypoints
const formatWaypoints = (via_waypoints) => {
  return via_waypoints.map(point => ({
    location: new window.google.maps.LatLng(point.lat, point.lng),
    stopover: false, // No son paradas explícitas
  }));
};

// Función auxiliar para manejar la solicitud de direcciones
const getDirections = (route, setDirections) => {
  const directionsService = new window.google.maps.DirectionsService();
  const origin = new window.google.maps.LatLng(route.origin.lat, route.origin.lng);
  const destination = new window.google.maps.LatLng(route.destination.lat, route.destination.lng);
  
  const waypoints = formatWaypoints(route.via_waypoints); // Usamos via_waypoints

  directionsService.route({
    origin,
    destination,
    waypoints,
    travelMode: window.google.maps.TravelMode.DRIVING,
  }, (result, status) => {
    if (status === window.google.maps.DirectionsStatus.OK) {
      setDirections(result);
    } else {
      console.error('Error fetching directions:', status);
    }
  });
};

function RouteMap() {
  const { routeId } = useParams();
  const [route, setRoute] = useState(null);
  const [locations, setLocations] = useState([]);
  const [directions, setDirections] = useState(null);
  const [busStops, setBusStops] = useState([]); // Para almacenar las paradas
  const [userLocation, setUserLocation] = useState(null); // Para la ubicación del usuario

  // Obtener la ubicación del usuario en tiempo real
  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
      }, (error) => {
        console.error('Error getting user location:', error);
      });

      // Limpiar el watcher al desmontar el componente
      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  useEffect(() => {
    fetchRouteById(routeId)
      .then(data => {
        try {
          const via_waypoints = JSON.parse(data.route.via_waypoints); // Accede a via_waypoints
          const origin = JSON.parse(data.route.origin);
          const destination = JSON.parse(data.route.destination);
          const busStops = data.route.bus_stops ? JSON.parse(data.route.bus_stops) : []; // Verificar si hay paradas

          if (origin && destination && Array.isArray(via_waypoints)) {
            setRoute({ ...data.route, origin, destination, via_waypoints }); // Guarda via_waypoints
            setLocations(data.locations);
            setBusStops(busStops); // Guarda las paradas, o un array vacío si no hay
          } else {
            console.error('Invalid route data:', data);
          }
        } catch (error) {
          console.error('Error parsing route data:', error);
        }
      })
      .catch(error => console.error('Error fetching route details:', error));
  }, [routeId]);

  useEffect(() => {
    if (route && route.origin && route.destination) {
      getDirections(route, setDirections);
    }
  }, [route]);

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={route?.origin || { lat: 9.945771786956337, lng: -84.19012069702148 }}
      zoom={14}
      options={{ gestureHandling: 'greedy' }}
    >
      {directions && <DirectionsRenderer directions={directions} options={{ suppressMarkers: true }} />}
      {console.log(directions)} {/* datOs de la ruta */}
      {route?.origin && <Marker position={route.origin}  label={{ text: "A", color: 'white', fontWeight: 'bold' }} />}
      {route?.destination && <Marker position={route.destination}  label={{ text: "B", color: 'white', fontWeight: 'bold' }}  />}
      
      {locations.map((location, index) => (
        <Marker
          key={index}
          position={{ lat: location.latitude, lng: location.longitude }}
          icon={{
            url: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png", // URL de un icono amarillo
            scaledSize: new window.google.maps.Size(30, 30), // Ajustar el tamaño del icono si es necesario
          }}
        />
      ))}

      {busStops.length > 0 && busStops.map((stop, index) => (
        <Marker 
          key={index} 
          position={{ lat: stop.lat, lng: stop.lng }} 
          label={{ text: `${index + 1}`, color: 'white', fontWeight: 'bold' }}
        />
      ))}

      {/* Marcador azul para la ubicación del usuario */}
      {userLocation && (
        <Marker
          position={userLocation}
          icon={{
            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png", // URL de un icono azul
            scaledSize: new window.google.maps.Size(30, 30), // Ajustar el tamaño del icono si es necesario
          }}
        />
      )}
    </GoogleMap>
  );
}

export default RouteMap;
