import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import Map from '../Map/Map';

function Home() {
  const navigate = useNavigate();

  const handleRouteClick = () => {
    navigate('/map');
  };

  return (
    <div className="p-5">
      <div><h1>Bus-car Rutas</h1></div>

      <div className="mb-3">
        <input type="text" className="form-control" placeholder="Buscar ruta" />
      </div>

      <div className="routes-container mb-3">
        {[...Array(9)].map((_, index) => (
          <div 
            key={index}
            className="div-color"
            onClick={handleRouteClick}
          >
            <h1>Ruta</h1>
          </div>
        ))}
      </div>

      <div id="map-container">
        <Map />
      </div>
    </div>
  );
}

export default Home;
