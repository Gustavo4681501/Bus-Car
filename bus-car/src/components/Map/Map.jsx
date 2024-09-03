import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';
import './Map.css';  // Asegúrate de importar el CSS

const API_KEY = "AIzaSyC9daW8QnV6HJ6UoxwoKr16lcK08xMvrmY";

const containerStyle = {
  width: '100%',
  height: '100vh'  // Full viewport height
};

const center = {
  lat: -3.745,
  lng: -38.523
};

function Map() {
  const navigate = useNavigate();  // Hook para redirigir

  const handleGoHome = () => {
    navigate('/');  // Redirige a la ruta '/'
  };

  return (
    <div id="map-container">
      <LoadScript googleMapsApiKey={API_KEY}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
          options={{
            mapTypeControl: false,  // Quita el botón de Mapa/Satélite
            streetViewControl: false, // Quita el control de Street View
          }}
        >
          <Marker position={center} />
        </GoogleMap>
      </LoadScript>
      <button
        onClick={handleGoHome}
        className="back-button"
      >
        Volver a Inicio
      </button>
    </div>
  );
}

export default Map;
