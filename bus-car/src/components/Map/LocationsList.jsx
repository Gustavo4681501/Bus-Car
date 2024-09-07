import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function LocationsList() {
  const [locations, setLocations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3000/api/locations')
      .then(response => response.json())
      .then(data => setLocations(data))
      .catch(error => console.error('Error fetching locations:', error));
  }, []);

  const handleSelectRoute = (destination) => {
    navigate('/map', { state: { destination } });
  };

  return (
    <div>
      <h2>Lista de ubicaciones</h2>
      <ul>
        {locations.map((loc) => (
          <li key={loc.user_id}>
            <button onClick={() => handleSelectRoute({ lat: loc.latitude, lng: loc.longitude })}>
              Ver ruta hacia {loc.user_id}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LocationsList;
