import React from 'react';
import { GoogleMap, DirectionsRenderer, Marker } from '@react-google-maps/api';
import './GetRouteMap.css'; // Asegúrate de importar el CSS
import LocationManager from '../LocationManager/LocationManager';

const containerStyle = {
  width: '100%',
  height: '100vh',
};

const GetRouteMap = ({ directions, route, locations, busStops, userLocation, showTraffic, mapRef, setShowTraffic }) => {
  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <LocationManager></LocationManager>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={route?.origin || { lat: 9.945771786956337, lng: -84.19012069702148 }}
        zoom={14}
        options={{ gestureHandling: 'greedy' }}
        onLoad={(map) => (mapRef.current = map)} // Guardar la referencia al mapa cuando se carga
      >
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              suppressMarkers: true,
              polylineOptions: {
                strokeColor: '#0000FF',
                strokeOpacity: 0.5,
                strokeWeight: 6,
                zIndex: 2,
              },
            }}
          />
        )}

        {route?.origin && (
          <Marker
            position={route.origin}
            label={{ text: "A", color: 'white', fontWeight: 'bold' }}
          />
        )}
        {route?.destination && (
          <Marker
            position={route.destination}
            label={{ text: "B", color: 'white', fontWeight: 'bold' }}
          />
        )}

        {locations.map((location, index) => (
          <Marker
            key={index}
            position={{ lat: location.latitude, lng: location.longitude }}
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
              scaledSize: new window.google.maps.Size(30, 30),
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

        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              scaledSize: new window.google.maps.Size(30, 30),
            }}
          />
        )}
      </GoogleMap>

      {/* Botón para mostrar tráfico */}
      <button className="traffic-button" onClick={() => setShowTraffic(!showTraffic)}>
        {showTraffic ? 'Ocultar Tráfico' : 'Mostrar Tráfico'}
      </button>
    </div>
  );
};

export default GetRouteMap;
