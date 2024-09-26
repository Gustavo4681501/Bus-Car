import React, { useState, useEffect, useRef, memo } from 'react';
import { DirectionsRenderer, GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { saveRoute } from '../../api/routeApi';

const API_KEY = "AIzaSyC9daW8QnV6HJ6UoxwoKr16lcK08xMvrmY"; // Asegúrate de usar tu propia API key

const containerStyle = {
  width: '80vw',
  height: '80vh',
};

const MapComponent = memo(({ mapOptions, directions, userLocation, handleMapLoad }) => (
  <GoogleMap
    id="map-container"
    mapContainerStyle={containerStyle}
    onLoad={handleMapLoad}
    options={mapOptions}
    zoom={14}
    center={userLocation || { lat: 0, lng: 0 }}
  >
    {directions && (
      <DirectionsRenderer
        directions={directions}
        options={{ draggable: true }} // Permitir que la ruta sea arrastrable
      />
    )}
    {userLocation && (
      <Marker
        position={userLocation}
        icon='http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
      />
    )}
  </GoogleMap>
));

function InteractiveRouteForm({ onRouteCreated }) {
  const [map, setMap] = useState(null);
  const [directions, setDirections] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const mapRef = useRef();
  const directionsService = useRef();
  const autocompleteOriginRef = useRef();
  const autocompleteDestinationRef = useRef();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newLocation = { lat: latitude, lng: longitude };
          setUserLocation(newLocation);
          if (mapRef.current) {
            mapRef.current.setCenter(newLocation);
          }
        },
        (error) => console.error('Error getting location:', error),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    }
  }, []);

  useEffect(() => {
    if (directionsService.current && origin && destination) {
      const request = {
        origin,
        destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      };
  
      directionsService.current.route(request, (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error(`Error fetching directions: ${status}`);
        }
      });
    }
  }, [origin, destination]);
  

  const handleMapLoad = (mapInstance) => {
    mapRef.current = mapInstance;
    setMap(mapInstance);
    directionsService.current = new window.google.maps.DirectionsService();
    
    const autocompleteOrigin = new window.google.maps.places.Autocomplete(autocompleteOriginRef.current);
    const autocompleteDestination = new window.google.maps.places.Autocomplete(autocompleteDestinationRef.current);

    autocompleteOrigin.bindTo('bounds', mapInstance);
    autocompleteDestination.bindTo('bounds', mapInstance);

    autocompleteOrigin.addListener('place_changed', () => {
      const place = autocompleteOrigin.getPlace();
      setOrigin(place.formatted_address);
    });

    autocompleteDestination.addListener('place_changed', () => {
      const place = autocompleteDestination.getPlace();
      setDestination(place.formatted_address);
    });
  };

  const handleSaveRoute = () => {
    if (directions) {
      // Obtén solo el Punto A y el Punto B
      const points = [
        {
          lat: directions.routes[0].legs[0].start_location.lat(),
          lng: directions.routes[0].legs[0].start_location.lng(),
        },
        {
          lat: directions.routes[0].legs[0].end_location.lat(),
          lng: directions.routes[0].legs[0].end_location.lng(),
        },
      ];

      // Llama a la función para guardar la ruta con los puntos
      saveRoute(points)
        .then(data => onRouteCreated(data))
        .catch(error => console.error('Error creating route:', error));
    } else {
      console.warn('No route to save');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <input 
          ref={autocompleteOriginRef}
          type="text" 
          placeholder="Punto A" 
          value={origin} 
          onChange={(e) => setOrigin(e.target.value)} 
        />
        <input 
          ref={autocompleteDestinationRef}
          type="text" 
          placeholder="Punto B" 
          value={destination} 
          onChange={(e) => setDestination(e.target.value)} 
        />
        <button onClick={() => { setOrigin(origin); setDestination(destination); }}>Calcular Ruta</button>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <button onClick={handleSaveRoute}>Guardar Ruta</button>
      </div>
      <LoadScript googleMapsApiKey={API_KEY} libraries={['places']}>
        <MapComponent
          mapOptions={{ disableDefaultUI: true }}
          directions={directions}
          userLocation={userLocation}
          handleMapLoad={handleMapLoad}
        />
      </LoadScript>
    </div>
  );
}

export default InteractiveRouteForm;
