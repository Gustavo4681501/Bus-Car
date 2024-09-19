import React, { useState, useEffect, useRef, memo } from 'react';
import { DirectionsRenderer, GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';
import { saveRoute } from '../../api/routeApi'; // Importa la función saveRoute

const API_KEY = "AIzaSyC9daW8QnV6HJ6UoxwoKr16lcK08xMvrmY";

const containerStyle = {
  width: '80vw',
  height: '80vh',
};

const mapOptions = {
  disableDefaultUI: false,
  gestureHandling: 'greedy',
};

const MapComponent = memo(({ mapOptions, route, directions, points, userLocation, handleMapLoad, handleMarkerDragEnd, handleMarkerRightClick }) => (
  <GoogleMap
    id="map-container"
    mapContainerStyle={containerStyle}
    onLoad={handleMapLoad}
    options={mapOptions}
    zoom={14}
    center={userLocation || { lat: 0, lng: 0 }}
  >
    {/* Mostrar Polyline solo si hay al menos dos puntos */}
    {points.length > 1 && (
      <Polyline
        path={route}
        options={{ strokeColor: '#FF0000', strokeOpacity: 1.0, strokeWeight: 2, editable: true }}
      />
    )}
    {directions && (
      <DirectionsRenderer
        directions={directions}
        options={{ suppressMarkers: true }} // Esto oculta los marcadores A y B
      />
    )}
    {points.map((point, index) => (
      <Marker
        key={index}
        position={point}
        draggable={true} // Permitir que los puntos se puedan arrastrar
        onDragEnd={(e) => handleMarkerDragEnd(e, index)} // Detectar cuando se suelta el marcador
        onRightClick={() => handleMarkerRightClick(index)} // Permitir eliminar con clic derecho
      />
    ))}
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
  const [points, setPoints] = useState([]);
  const [route, setRoute] = useState([]);
  const [directions, setDirections] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const mapRef = useRef();
  const directionsService = useRef();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newLocation = { lat: latitude, lng: longitude };
          setUserLocation(newLocation);

          if (mapRef.current) {
            mapRef.current.setCenter(newLocation);
            mapRef.current.setZoom(14);
          }
        },
        (error) => console.error('Error getting location:', error),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    }
  }, []);

  useEffect(() => {
    if (map) {
      const onClick = (e) => {
        const { latLng } = e;
        const newPoint = { lat: latLng.lat(), lng: latLng.lng() };
        setPoints((prevPoints) => [...prevPoints, newPoint]);
      };

      map.addListener('click', onClick);

      return () => {
        window.google.maps.event.clearListeners(map, 'click');
      };
    }
  }, [map]);

  useEffect(() => {
    if (points.length >= 2) {
      const newRoute = points.map(p => new window.google.maps.LatLng(p.lat, p.lng));
      setRoute(newRoute);
      calculateAdjustedRoute(newRoute);
    } else {
      // Limpia la ruta y direcciones si hay menos de dos puntos
      setRoute([]);
      setDirections(null);
    }
  }, [points]);

  const calculateAdjustedRoute = (points) => {
    if (!window.google) {
      console.error('Google Maps API not loaded');
      return;
    }

    if (!directionsService.current) {
      directionsService.current = new window.google.maps.DirectionsService();
    }

    const origin = points[0];
    const destination = points[points.length - 1];
    const waypoints = points.slice(1, -1).map(p => ({ location: p, stopover: false }));

    const request = {
      origin,
      destination,
      waypoints,
      travelMode: window.google.maps.TravelMode.DRIVING,
      optimizeWaypoints: true,
    };

    directionsService.current.route(request, (result, status) => {
      if (status === window.google.maps.DirectionsStatus.OK) {
        setDirections(result);
      } else {
        console.error(`Error fetching directions: ${status}`);
      }
    });
  };

  const handleMapLoad = (mapInstance) => {
    mapRef.current = mapInstance;
    setMap(mapInstance);
  };

  const handleMarkerDragEnd = (e, index) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    const updatedPoints = [...points];
    updatedPoints[index] = { lat, lng };
    setPoints(updatedPoints);
  };

  const handleMarkerRightClick = (index) => {
    const updatedPoints = points.filter((_, i) => i !== index);
    setPoints(updatedPoints);

    if (updatedPoints.length < 2) {
      // Limpia la ruta y direcciones si hay menos de dos puntos
      setRoute([]);
      setDirections(null);
    } else {
      // Recalcular la ruta si aún hay suficientes puntos
      const newRoute = updatedPoints.map(p => new window.google.maps.LatLng(p.lat, p.lng));
      setRoute(newRoute);
      calculateAdjustedRoute(newRoute);
    }
  };

  const handleSaveRoute = () => {
    if (points.length >= 2) {
      saveRoute(points)
        .then(data => onRouteCreated(data))
        .catch(error => console.error('Error creating route:', error));
    } else {
      console.warn('You need at least two points to save a route');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <button onClick={handleSaveRoute}>Save Route</button>
      </div>
      <LoadScript googleMapsApiKey={API_KEY}>
        <MapComponent
          mapOptions={mapOptions}
          route={route}
          directions={directions}
          points={points}
          userLocation={userLocation}
          handleMapLoad={handleMapLoad}
          handleMarkerDragEnd={handleMarkerDragEnd}
          handleMarkerRightClick={handleMarkerRightClick}
        />
      </LoadScript>
    </div>
  );
}

export default InteractiveRouteForm;
