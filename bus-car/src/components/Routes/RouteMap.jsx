import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GoogleMap, LoadScript, DirectionsRenderer } from '@react-google-maps/api';
import { fetchRouteDetails } from '../../api/routeApi'; // Importa la función fetchRouteDetails

const API_KEY = "AIzaSyC9daW8QnV6HJ6UoxwoKr16lcK08xMvrmY"; // Reemplaza con tu API Key

const containerStyle = {
  width: '100%',
  height: '100vh'
};

function RouteMap() {
  const { routeId } = useParams(); // Obtiene la ID de la ruta desde la URL
  const [route, setRoute] = useState(null);
  const [directions, setDirections] = useState(null);

  useEffect(() => {
    // Fetch la ruta desde la API usando la nueva función
    fetchRouteDetails(routeId)
      .then(data => {
        console.log('Raw route data:', data); // Verifica los datos crudos

        try {
          // Parsear los waypoints almacenados como string
          const waypoints = JSON.parse(data.waypoints);
          console.log('Parsed waypoints:', waypoints); // Verifica los waypoints parseados

          if (Array.isArray(waypoints) && waypoints.length > 1) {
            setRoute({
              ...data,
              waypoints
            });
          } else {
            console.error('Invalid waypoints:', waypoints);
          }
        } catch (error) {
          console.error('Error parsing waypoints:', error);
        }
      })
      .catch(error => console.error('Error fetching route details:', error));
  }, [routeId]);

  useEffect(() => {
    if (route) {
      const directionsService = new window.google.maps.DirectionsService();

      // Definir origen y destino
      const origin = new window.google.maps.LatLng(route.waypoints[0].lat, route.waypoints[0].lng);
      const destination = new window.google.maps.LatLng(route.waypoints[route.waypoints.length - 1].lat, route.waypoints[route.waypoints.length - 1].lng);

      // Definir los puntos intermedios
      const waypoints = route.waypoints.slice(1, -1).map(point => ({
        location: new window.google.maps.LatLng(point.lat, point.lng),
        stopover: true
      }));

      // Solicitar la ruta al servicio de direcciones
      directionsService.route({
        origin,
        destination,
        waypoints,
        travelMode: window.google.maps.TravelMode.DRIVING
      }, (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error('Error fetching directions:', status);
        }
      });
    }
  }, [route]);

  return (
    <LoadScript googleMapsApiKey={API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={{ lat: 9.945771786956337, lng: -84.19012069702148 }} // Coordenadas iniciales
        zoom={14}
      >
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </LoadScript>
  );
}

export default RouteMap;
