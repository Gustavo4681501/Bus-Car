import React, { memo } from 'react';
import { DirectionsRenderer, GoogleMap, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '80vw',
  height: '80vh',
};

// Componente memoizado para optimizar la carga del mapa
const CreateRouteMap = memo(({ mapOptions, directions, userLocation, handleMapLoad, onDirectionsLoad, busStops, onMapClick, onMarkerDragEnd }) => (
  <div className='d-flex justify-content-center'>
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
  </GoogleMap>
  </div>
));

export default CreateRouteMap;
