import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import EditRouteMap from './EditRouteMap';
import { fetchRouteById, updateRoute } from '../../../api/routeApi';
import './EditRoute.css'; // Asegúrate de importar el CSS

const formatWaypoints = (waypoints) => {
  return waypoints.map(point => ({
    location: new window.google.maps.LatLng(point.lat, point.lng),
    stopover: false,
  }));
};

function EditRoute() {
  const { routeId } = useParams();
  const [route, setRoute] = useState(null);
  const [directions, setDirections] = useState(null);
  const [busStops, setBusStops] = useState([]);
  const [viaWaypoints, setViaWaypoints] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 9.945771786956337, lng: -84.19012069702148 });

  // Añadimos un estado para el nombre de la ruta
  const [routeName, setRouteName] = useState('');
  const [origin, setOrigin] = useState(''); // Inicialmente vacío
  const [destination, setDestination] = useState(''); // Inicialmente vacío

  const mapRef = useRef();
  const directionsRendererRef = useRef();
  const originRef = useRef();
  const destinationRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchRouteById(routeId);
        const origin = JSON.parse(data.route.origin);
        const destination = JSON.parse(data.route.destination);
        const via_waypoints = JSON.parse(data.route.via_waypoints) || [];
        const busStops = JSON.parse(data.route.bus_stops) || [];

        setRoute({ ...data.route, origin, destination, via_waypoints });
        setRouteName(data.route.name); // Establecemos el nombre de la ruta
        setBusStops(busStops);
        setViaWaypoints(via_waypoints);

        if (origin) {
          setMapCenter(origin);
          originRef.current = origin;
        }
        if (destination) {
          // Guardamos el destino en formato string
          setDestination(destination.name || ''); // Asegúrate de que 'name' exista en el objeto
        }
      } catch (error) {
        console.error('Error fetching route details:', error);
      }
    };
    fetchData();
  }, [routeId]);

  useEffect(() => {
    if (route && route.origin && route.destination) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route({
        origin: new window.google.maps.LatLng(route.origin.lat, route.origin.lng),
        destination: new window.google.maps.LatLng(route.destination.lat, route.destination.lng),
        waypoints: formatWaypoints(viaWaypoints),
        travelMode: window.google.maps.TravelMode.DRIVING,
        optimizeWaypoints: true,
      }, (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error('Error fetching directions:', status);
        }
      });
    }
  }, [route]);

  const handleMapLoad = (map) => {
    mapRef.current = map;
  };

  const handleMapClick = (event) => {
    const { latLng } = event;
    const newBusStop = { lat: latLng.lat(), lng: latLng.lng() };
    setBusStops(prevStops => [...prevStops, newBusStop]);
  };

  const handleMarkerClick = (index) => {
    const updatedStops = busStops.filter((_, i) => i !== index);
    setBusStops(updatedStops);
  };

  const handleMarkerDragEnd = (index, event) => {
    const updatedStops = [...busStops];
    updatedStops[index] = { lat: event.latLng.lat(), lng: event.latLng.lng() };
    setBusStops(updatedStops);
  };

  const handleSaveRoute = async () => {
    const routeToSave = {
      ...route,
      bus_stops: busStops,
      via_waypoints: viaWaypoints,
      name: routeName,
      origin: originRef.current,
      destination: destinationRef.current,
    };

    try {
      await updateRoute(routeId, routeToSave);
      console.log("Ruta actualizada con éxito!\n", "id:", routeId, "\ndatos ruta", routeToSave);
    } catch (error) {
      console.error('Error actualizando la ruta:', error);
    }
  };

  const updateOriginAndDestination = (newOrigin, newDestination) => {
    if (newOrigin && (!originRef.current || originRef.current.lat !== newOrigin.lat || originRef.current.lng !== newOrigin.lng)) {
      setRoute(prevRoute => ({
        ...prevRoute,
        origin: newOrigin,
      }));
      originRef.current = newOrigin;
    }
  
    if (newDestination && (!destinationRef.current || destinationRef.current.lat !== newDestination.lat || destinationRef.current.lng !== newDestination.lng)) {
      setRoute(prevRoute => ({
        ...prevRoute,
        destination: newDestination,
      }));
      destinationRef.current = newDestination;
    }
  };
  

  const handleInputChange = (e, type) => {
    const value = e.target.value;
    if (type === 'name') setRouteName(value);
    if (type === 'origin') {
      setOrigin(value); // Solo actualizamos el nombre aquí
      originRef.current = value; // Guardamos el nombre también en originRef
      // Solo actualizamos el origen y verificamos si el destino ya está disponible
      if (destinationRef.current) {
        updateOriginAndDestination({ lat: originRef.current.lat, lng: originRef.current.lng }, destinationRef.current);
      }
    }
    if (type === 'destination') {
      setDestination(value); // Solo actualizamos el nombre aquí
      destinationRef.current = value; // Guardamos el nombre también en destinationRef
      // Solo actualizamos el destino y verificamos si el origen ya está disponible
      if (originRef.current) {
        updateOriginAndDestination(originRef.current, { lat: destinationRef.current.lat, lng: destinationRef.current.lng });
      }
    }
  };
  

  useEffect(() => {
    const originInput = document.getElementById('origin');
    const destinationInput = document.getElementById('destination');
    
    const autocompleteOrigin = new window.google.maps.places.Autocomplete(originInput, {
      componentRestrictions: { country: 'CR' }, // Restringir a Costa Rica
    });

    const autocompleteDestination = new window.google.maps.places.Autocomplete(destinationInput, {
      componentRestrictions: { country: 'CR' }, // Restringir a Costa Rica
    });

    autocompleteOrigin.addListener('place_changed', () => {
      const place = autocompleteOrigin.getPlace();
      if (place.geometry) {
        const newOrigin = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setOrigin(place.name); // Almacena solo el nombre
        originRef.current = place.name; // Guardamos el nombre como referencia
        updateOriginAndDestination(newOrigin, destinationRef.current);
      }
    });

    autocompleteDestination.addListener('place_changed', () => {
      const place = autocompleteDestination.getPlace();
      if (place.geometry) {
        const newDestination = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setDestination(place.name); // Almacena solo el nombre
        destinationRef.current = place.name; // Guardamos el nombre como referencia
        updateOriginAndDestination(originRef.current, newDestination);
      }
    });
  }, []);
  

  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <div className="form-container">
        <label htmlFor="route-name">Nombre de la Ruta:</label>
        <input
          type="text"
          id="route-name"
          value={routeName}
          onChange={(e) => handleInputChange(e, 'name')}
        />
        
        <label htmlFor="origin">Origen:</label>
        <input
          type="text"
          id="origin"
          value={origin}
          onChange={(e) => handleInputChange(e, 'origin')}
          placeholder="Ej: San José, Costa Rica"
        />
        
        <label htmlFor="destination">Destino:</label>
        <input
          type="text"
          id="destination"
          value={destination}
          onChange={(e) => handleInputChange(e, 'destination')}
          placeholder="Ej: Liberia, Costa Rica"
        />
      </div>
      
      <EditRouteMap
        mapCenter={mapCenter}
        directions={directions}
        busStops={busStops}
        handleMapLoad={handleMapLoad}
        handleMapClick={handleMapClick}
        handleMarkerClick={handleMarkerClick}
        handleMarkerDragEnd={handleMarkerDragEnd}
        directionsRendererRef={directionsRendererRef}
        updateOriginAndDestination={updateOriginAndDestination}
        viaWaypoints={viaWaypoints}
        setViaWaypoints={setViaWaypoints}
      />
      
      <button className="save-route-button" onClick={handleSaveRoute}>
        Guardar Ruta
      </button>
    </div>
  );
}

export default EditRoute;
