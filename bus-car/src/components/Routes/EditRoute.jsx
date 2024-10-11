import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { GoogleMap, DirectionsRenderer, Marker } from '@react-google-maps/api';
import { fetchRouteById, updateRoute } from '../../api/routeApi';

const containerStyle = {
  width: '100%',
  height: '100vh',
};

const formatWaypoints = (waypoints) => {
  return waypoints.map(point => ({
    location: new window.google.maps.LatLng(point.lat, point.lng),
    stopover: false,
  }));
};

function EditRouteMap() {
  const { routeId } = useParams();
  const [route, setRoute] = useState(null);
  const [directions, setDirections] = useState(null);
  const [busStops, setBusStops] = useState([]);
  const [viaWaypoints, setViaWaypoints] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 9.945771786956337, lng: -84.19012069702148 });

  const mapRef = useRef();
  const directionsRendererRef = useRef();
  
  // Usando useRef para almacenar los valores actuales del origen y destino
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
        setBusStops(busStops);
        setViaWaypoints(via_waypoints);
        
        // Establecer el centro del mapa solo una vez al cargar la ruta
        if (origin) {
          setMapCenter(origin);
          originRef.current = origin; // Guardar el origen actual en useRef
        }
        if (destination) {
          destinationRef.current = destination; // Guardar el destino actual en useRef
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
    };

    try {
      await updateRoute(routeId, routeToSave);
      console.log("Ruta actualizada con éxito!\n","id:", routeId,"\ndatos ruta", routeToSave);
    } catch (error) {
      console.error('Error actualizando la ruta:', error);
    }
  };

  // Función para verificar si se necesita actualizar el origen y destino
  const updateOriginAndDestination = (newOrigin, newDestination) => {
    if (!originRef.current || (originRef.current.lat !== newOrigin.lat || originRef.current.lng !== newOrigin.lng)) {
      setRoute(prevRoute => ({
        ...prevRoute,
        origin: newOrigin,
      }));
      originRef.current = newOrigin; // Actualizar referencia
    }

    if (!destinationRef.current || (destinationRef.current.lat !== newDestination.lat || destinationRef.current.lng !== newDestination.lng)) {
      setRoute(prevRoute => ({
        ...prevRoute,
        destination: newDestination,
      }));
      destinationRef.current = newDestination; // Actualizar referencia
    }
  };

  return (
    <div>
      <button onClick={handleSaveRoute}>Guardar Ruta</button>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={14}
        onLoad={handleMapLoad}
        onClick={handleMapClick}
        options={{gestureHandling: 'greedy' }}
      >
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{ draggable: true }}
            onLoad={(ref) => { directionsRendererRef.current = ref; }}
            onDirectionsChanged={() => {
              if (directionsRendererRef.current) {
                const waypoints = directionsRendererRef.current.getDirections().routes[0].legs[0].via_waypoints;
                const updatedWaypoints = waypoints.map(waypoint => ({
                  lat: waypoint.lat(),
                  lng: waypoint.lng(),
                }));
                setViaWaypoints(updatedWaypoints);
                
                // Actualizar origen y destino basado en arrastre
                const newOrigin = {
                  lat: directionsRendererRef.current.getDirections().routes[0].legs[0].start_location.lat(),
                  lng: directionsRendererRef.current.getDirections().routes[0].legs[0].start_location.lng(),
                };
                const newDestination = {
                  lat: directionsRendererRef.current.getDirections().routes[0].legs[0].end_location.lat(),
                  lng: directionsRendererRef.current.getDirections().routes[0].legs[0].end_location.lng(),
                };

                // Llamar a la función para actualizar origen y destino
                updateOriginAndDestination(newOrigin, newDestination);
              }
            }}
          />
        )}
        {busStops.map((stop, index) => (
          <Marker
            key={`bus-stop-${index}`}
            position={{ lat: stop.lat, lng: stop.lng }}
            label={{ text: `${index + 1}`, color: 'white', fontWeight: 'bold' }}
            onClick={() => handleMarkerClick(index)}
            draggable
            onDragEnd={(event) => handleMarkerDragEnd(index, event)}
          />
        ))}
      </GoogleMap>
    </div>
  );
}

export default EditRouteMap;
