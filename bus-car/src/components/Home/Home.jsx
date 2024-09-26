import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import Map from '../Map/Map';
import LocationsList from '../Map/LocationsList';
import RouteList from '../Routes/RouteList';
import InteractiveRouteForm from '../Routes/InteractiveRouteForm';
import LocationManager from '../Routes/LocationManager/LocationManager';

function Home() {
  const navigate = useNavigate();

  const handleRouteClick = () => {
    navigate('/map');
  };

  return (
    <div className="p-5">
      <div><h1>Bus-car ubicaciones</h1></div>

      <div className="mb-3">
        <input type="text" className="form-control" placeholder="Buscar ruta" />
      </div>

      

      <div className="map-container">
        <div id="map-container">
        <LocationManager />
          <LocationsList/>
          <RouteList/>
        <InteractiveRouteForm onRouteCreated={(newRoute) => console.log(newRoute)} />
          {/* <Map /> */}
        </div>
      </div>
    </div>
  );
}

export default Home;
