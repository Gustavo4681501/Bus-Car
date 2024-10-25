import React from 'react';
import './Home.css';
import Map from '../Map/Map';
import LocationsList from '../Map/LocationsList';
import RouteList from '../Routes/GetRoute/RouteList/RouteList';
import LocationManager from '../Routes/LocationManager/LocationManager';
import CreateRoute from '../Routes/CreateRoute/CreateRoute';
import BuscarNavbar from '../Navbar/Navbar';

function Home() {

  return (
    <div className="p-5 container">
       <BuscarNavbar/>
      <div className="map-container">
        <div id="map-container">
         
          <LocationManager />
          <RouteList />
          <LocationsList />
          <Map />
        </div>
      </div>
    </div>
  );
}

export default Home;
