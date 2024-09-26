import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GoogleMap, LoadScript, DirectionsRenderer, Marker } from '@react-google-maps/api';
import { fetchRouteDetails } from '../../api/routeApi';

const API_KEY = "AIzaSyC9daW8QnV6HJ6UoxwoKr16lcK08xMvrmY"; // Reemplaza con tu API Key

const containerStyle = {
  width: '100%',
  height: '100vh'
};

function RouteMap() {
  const { routeId } = useParams();
  const [route, setRoute] = useState(null);
  const [locations, setLocations] = useState([]);
  const [directions, setDirections] = useState(null);

  useEffect(() => {
    fetchRouteDetails(routeId)
      .then(data => {
        console.log('Raw route data:', data); // Verifica los datos crudos

        try {
          const waypoints = JSON.parse(data.route.waypoints);
          if (Array.isArray(waypoints) && waypoints.length > 0) {
            setRoute({
              ...data.route,
              waypoints
            });
            setLocations(data.locations);
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
    if (route && route.waypoints.length > 0) {
      const directionsService = new window.google.maps.DirectionsService();

      const origin = new window.google.maps.LatLng(route.waypoints[0].lat, route.waypoints[0].lng);
      const destination = new window.google.maps.LatLng(route.waypoints[route.waypoints.length - 1].lat, route.waypoints[route.waypoints.length - 1].lng);

      const waypoints = route.waypoints.slice(1, -1).map(point => ({
        location: new window.google.maps.LatLng(point.lat, point.lng),
        stopover: true
      }));

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
        center={route && route.waypoints.length > 0 ? { lat: route.waypoints[0].lat, lng: route.waypoints[0].lng } : { lat: 9.945771786956337, lng: -84.19012069702148 }} // Coordenadas iniciales
        zoom={14}
      >
        {directions && <DirectionsRenderer directions={directions} />}
        
        {/* Mostrar las ubicaciones como marcadores */}
        {locations.map((location, index) => (
          <Marker
            key={index}
            position={{ lat: location.latitude, lng: location.longitude }}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
}

export default RouteMap;
