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
        setBusStops(busStops);
        setViaWaypoints(via_waypoints);

        if (origin) {
          setMapCenter(origin);
          originRef.current = origin;
        }
        if (destination) {
          destinationRef.current = destination;
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
      console.log("Ruta actualizada con éxito!\n", "id:", routeId, "\ndatos ruta", routeToSave);
    } catch (error) {
      console.error('Error actualizando la ruta:', error);
    }
  };

  const updateOriginAndDestination = (newOrigin, newDestination) => {
    if (!originRef.current || (originRef.current.lat !== newOrigin.lat || originRef.current.lng !== newOrigin.lng)) {
      setRoute(prevRoute => ({
        ...prevRoute,
        origin: newOrigin,
      }));
      originRef.current = newOrigin;
    }

    if (!destinationRef.current || (destinationRef.current.lat !== newDestination.lat || destinationRef.current.lng !== newDestination.lng)) {
      setRoute(prevRoute => ({
        ...prevRoute,
        destination: newDestination,
      }));
      destinationRef.current = newDestination;
    }
  };

  return (
    <div style={{ position: 'relative', height: '100vh' }}>
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
      
      {/* Botón para guardar la ruta en la esquina superior derecha */}
      <button className="save-route-button" onClick={handleSaveRoute}>
        Guardar Ruta
      </button>
    </div>
  );
}

export default EditRoute;
