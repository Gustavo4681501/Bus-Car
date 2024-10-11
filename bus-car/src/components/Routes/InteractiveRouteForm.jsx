import React, { useState, useEffect, useRef, memo } from 'react';
import { DirectionsRenderer, GoogleMap, Marker, TrafficLayer } from '@react-google-maps/api';
import { saveRoute } from '../../api/routeApi';

const containerStyle = {
  width: '80vw',
  height: '80vh',
};

// Componente memoizado para optimizar la carga del mapa
const MapComponent = memo(({mapOptions, directions, userLocation, handleMapLoad, onDirectionsLoad, busStops, onMapClick, onMarkerDragEnd}) => (
  <GoogleMap
    id="map-container"
    mapContainerStyle={containerStyle}
    onLoad={handleMapLoad}
    center={userLocation || { lat: 0, lng: 0 }}
    zoom={14}
    options={mapOptions}
    onClick={onMapClick} // Evento de clic en el mapa para agregar marcadores
  >
    {directions && (
      <DirectionsRenderer
        directions={directions}
        options={{ draggable: true }}
        onLoad={onDirectionsLoad}
      />
    )}
    {userLocation && (
      <Marker
        position={userLocation}
        icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
      />
    )}
    {busStops.map((stop, index) => (
      <Marker
        key={index}
        position={stop}
        draggable={true} // Hacer que los marcadores sean arrastrables
        onDragEnd={(e) => onMarkerDragEnd(e, index)} // Detectar cuando el marcador se mueve
        onClick={() => onMarkerDragEnd(null, index, true)} // Eliminar marcador si se hace clic en él
        label={{ text: `${index + 1}`, color: 'white', fontWeight: 'bold' }} // Etiqueta con el número de la parada
      />
    ))}

    {/* velocidad de todas las rutas util para el mapa del main */}
    {/* <TrafficLayer /> */}
  </GoogleMap>
));

function InteractiveRouteForm({ onRouteCreated }) {
  const [directions, setDirections] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [addingBusStops, setAddingBusStops] = useState(false); // Estado para activar/desactivar el modo de agregar paradas
  const [busStops, setBusStops] = useState([]); // Estado para guardar las ubicaciones de los marcadores

  const mapRef = useRef();
  const directionsRendererRef = useRef();
  const directionsService = useRef(new window.google.maps.DirectionsService());
  const autocompleteOriginRef = useRef();
  const autocompleteDestinationRef = useRef();

  // Obtener la ubicación del usuario
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) => {
          const newLocation = { lat: latitude, lng: longitude };
          setUserLocation(newLocation);
          mapRef.current?.setCenter(newLocation);
        },
        (error) => console.error('Error getting location:', error),
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  }, []);

  // Calcular ruta
  useEffect(() => {
    if (origin && destination) {
      const request = {
        origin,
        destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
        unitSystem: window.google.maps.UnitSystem.METRIC,
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

  // Escuchar cambios en las paradas de autobús y enumerarlas
  useEffect(() => {
    console.log('Paradas de autobús:', busStops.map((stop, index) => `${index + 1}: (${stop.lat}, ${stop.lng})`));
  }, [busStops]);

  const handleMapLoad = (mapInstance) => {
    mapRef.current = mapInstance;

    const initAutocomplete = (ref, setPlace) => {
      const autocomplete = new window.google.maps.places.Autocomplete(ref.current);
      autocomplete.bindTo('bounds', mapInstance);
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        setPlace(place.formatted_address);
      });
    };

    initAutocomplete(autocompleteOriginRef, setOrigin);
    initAutocomplete(autocompleteDestinationRef, setDestination);
  };

  const handleMapClick = (e) => {
    if (addingBusStops) {
      const newStop = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      setBusStops([...busStops, newStop]);
    }
  };

  const handleMarkerDragEnd = (e, index, remove = false) => {
    const newBusStops = [...busStops];
    if (remove) {
      newBusStops.splice(index, 1);
    } else if (e) {
      const newPosition = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      newBusStops[index] = newPosition;
    }
    setBusStops(newBusStops);
  };

  const toggleAddBusStops = () => {
    setAddingBusStops(!addingBusStops);
  };

  const handleSaveRoute = () => {
    const updatedDirections = directionsRendererRef.current?.getDirections();
    if (updatedDirections) {
      const { start_location, end_location, via_waypoints } = updatedDirections.routes[0].legs[0];
      const points = {
        origin: {
          lat: start_location.lat(),
          lng: start_location.lng(),
        },
        destination: {
          lat: end_location.lat(),
          lng: end_location.lng(),
        },
        via_waypoints: via_waypoints.map(wp => ({ lat: wp.lat(), lng: wp.lng() })),
        bus_stops: busStops // Añadir las paradas de autobús
      };

      saveRoute(points)
        .then(onRouteCreated)
        .catch(error => console.error('Error updating route:', error));
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
        <button onClick={toggleAddBusStops}>
          {addingBusStops ? 'Desactivar Paradas de Buses' : 'Activar Paradas de Buses'}
        </button>
      </div>
      <MapComponent
        mapOptions={{ disableDefaultUI: true, gestureHandling: 'greedy' }}
        directions={directions}
        userLocation={userLocation}
        handleMapLoad={handleMapLoad}
        onDirectionsLoad={(ref) => { directionsRendererRef.current = ref; }}
        busStops={busStops}
        onMapClick={handleMapClick}
        onMarkerDragEnd={handleMarkerDragEnd}
      />
    </div>
  );
}

export default InteractiveRouteForm;
