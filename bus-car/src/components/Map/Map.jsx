import React, { useEffect, useState, useRef, useContext } from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { useLocation } from 'react-router-dom';
import { SessionContext } from '../SessionContext';
import InteractiveRouteForm from '../Routes/InteractiveRouteForm';
import './Map.css';

const API_KEY = "AIzaSyC9daW8QnV6HJ6UoxwoKr16lcK08xMvrmY";

const containerStyle = {
  width: '100%',
  height: '100vh'
};

const blueMarkerIcon = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';

function Map() {
  const [userLocation, setUserLocation] = useState(null);
  const [locations, setLocations] = useState([]);
  const [directions, setDirections] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const mapRef = useRef();
  const { state } = useLocation();
  const { currUser } = useContext(SessionContext);

  useEffect(() => {
    fetch('http://localhost:3000/api/locations')
      .then(response => response.json())
      .then(data => {
        console.log('Fetched locations:', data);
        setLocations(data);
      })
      .catch(error => console.error('Error fetching locations:', error));
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetch('http://localhost:3000/api/locations')
        .then(response => response.json())
        .then(data => {
          console.log('Fetched locations:', data);
          setLocations(data);
        })
        .catch(error => console.error('Error fetching locations:', error));
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newLocation = { lat: latitude, lng: longitude };
          setUserLocation(newLocation);

          if (mapRef.current) {
            mapRef.current.setCenter(newLocation);
            mapRef.current.setZoom(14); // Ajusta el zoom según sea necesario
          }
        },
        (error) => console.error('Error getting location:', error),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    }
  }, []);

  useEffect(() => {
    if (state && state.destination) {
      setSelectedRoute({ waypoints: JSON.stringify([state.destination]) });
    }
  }, [state]);

  useEffect(() => {
    if (selectedRoute && userLocation) {
      if (window.google && window.google.maps) {
        const directionsService = new window.google.maps.DirectionsService();
        const waypoints = JSON.parse(selectedRoute.waypoints).map(p => ({
          location: new window.google.maps.LatLng(p.lat, p.lng),
          stopover: false
        }));

        directionsService.route({
          origin: userLocation,
          destination: waypoints.pop().location,
          waypoints,
          travelMode: window.google.maps.TravelMode.DRIVING
        }, (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            console.log("Directions result:", result);
            setDirections(result);
          } else {
            console.error(`Error fetching directions: ${status}`);
          }
        });
      } else {
        console.error('Google Maps API not loaded');
      }
    }
  }, [selectedRoute, userLocation]);

  const handleMapLoad = (mapInstance) => {
    mapRef.current = mapInstance;
    if (userLocation) {
      mapInstance.setCenter(userLocation);
      mapInstance.setZoom(14); // Ajusta el zoom según sea necesario
    }
  };

  return (
    <div id="map-container">
      <InteractiveRouteForm onRouteCreated={(newRoute) => setSelectedRoute(newRoute)} />
      <LoadScript googleMapsApiKey={API_KEY}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={userLocation || { lat: 0, lng: 0 }}
          zoom={14}
          onLoad={handleMapLoad}
          options={{
            mapTypeControl: false,
            streetViewControl: false
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
