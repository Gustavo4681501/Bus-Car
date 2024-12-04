import React from 'react';
import { GoogleMap, DirectionsRenderer, Marker } from '@react-google-maps/api';
import './GetRouteMap.css';

const containerStyle = {
  width: '100%',
  height: '100vh',
};

const renderDirections = (directions, color, opacity, weight, zIndex) => (
  <DirectionsRenderer
    directions={directions}
    options={{
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: color,
        strokeOpacity: opacity,
        strokeWeight: weight,
        zIndex,
      },
    }}
  />
);

const renderMarker = (position, label, onClick, title, iconUrl = null) => (
  <Marker
    position={position}
    label={label}
    onClick={onClick}
    title={title}
    icon={iconUrl ? { url: iconUrl, scaledSize: new window.google.maps.Size(30, 30) } : undefined}
  />
);

const GetRouteMap = ({
  directions,
  newRoute,
  route,
  locations = [],
  busStops = [],
  userLocation,
  showTraffic,
  mapRef,
  setShowTraffic,
  onBusStopClick,
  onOriginClick,
  onDestinationClick,
}) => {
  const defaultCenter = { lat: 9.945771786956337, lng: -84.19012069702148 };

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={route?.origin || defaultCenter}
        zoom={14}
        options={{ gestureHandling: 'greedy' }}
        onLoad={(map) => (mapRef.current = map)}
      >
        {/* Renderizar direcciones */}
        {directions && renderDirections(directions, '#0000FF', 0.5, 6, 2)}
        {newRoute && renderDirections(newRoute, '#FF0000', 0.7, 4, 1)}

        {/* Marcadores de Origen y Destino */}
        {route?.origin && renderMarker(route.origin, { text: 'A', color: 'white', fontWeight: 'bold' }, onOriginClick, 'Origen')}
        {route?.destination && renderMarker(route.destination, { text: 'B', color: 'white', fontWeight: 'bold' }, onDestinationClick, 'Destino')}

        {/* Marcadores de ubicaciones */}
        {locations.map((location, index) =>
          renderMarker(
            { lat: location.latitude, lng: location.longitude },
            null,
            null,
            `Ubicación ${index + 1}`,
            "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
          )
        )}

        {/* Marcadores de paradas de autobús*/}
        {busStops.map((stop, index) =>
          renderMarker(
            { lat: stop.lat, lng: stop.lng },
            { text: `${index + 1}`, color: 'white', fontWeight: 'bold' },
            () => onBusStopClick(stop),
            `Parada de autobús ${index + 1}`
          )
        )}

        {/* Marcador de la ubicación del usuario */}
        {userLocation &&
          renderMarker(
            userLocation,
            null,
            null,
            'Ubicación actual',
            "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
          )}
      </GoogleMap>

      {/* Botón para mostrar/ocultar tráfico */}
      <button className="traffic-button" onClick={() => setShowTraffic(!showTraffic)}>
        {showTraffic ? 'Ocultar Tráfico' : 'Mostrar Tráfico'}
      </button>
    </div>
  );
};

export default GetRouteMap;
