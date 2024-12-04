import React, { useEffect, useState, useRef, useContext } from 'react'; 
import { useParams } from 'react-router-dom';
import { fetchRouteById } from '../../../api/routeApi';
import GetRouteMap from './GetRouteMap';
import useUserLocation from './../../Location/useUserLocation';
import { fetchLocationsByRouteId } from '../../../api/locationApi';
import { SessionContext } from '../../Auth/Authentication/SessionContext';
import { updateLocation } from '../../../api/locationApi';

const formatWaypoints = (via_waypoints) => {
  return via_waypoints.map(point => ({
    location: new window.google.maps.LatLng(point.lat, point.lng),
    stopover: false,
  }));
};

const getDirections = (route, setDirections) => {
  const directionsService = new window.google.maps.DirectionsService();
  const origin = new window.google.maps.LatLng(route.origin.lat, route.origin.lng);
  const destination = new window.google.maps.LatLng(route.destination.lat, route.destination.lng);
  const waypoints = formatWaypoints(route.via_waypoints);

  directionsService.route({
    origin,
    destination,
    waypoints,
    travelMode: window.google.maps.TravelMode.DRIVING,
  }, (result, status) => {
    if (status === window.google.maps.DirectionsStatus.OK) {
      setDirections(result);
    } else {
      console.error('Error fetching directions:', status);
    }
  });
};

const getClosestRoute = (userLocation, busStop, setNewRoute) => {
  const directionsService = new window.google.maps.DirectionsService();
  directionsService.route({
    origin: new window.google.maps.LatLng(userLocation.lat, userLocation.lng),
    destination: new window.google.maps.LatLng(busStop.lat, busStop.lng),
    travelMode: window.google.maps.TravelMode.DRIVING,
  }, (result, status) => {
    if (status === window.google.maps.DirectionsStatus.OK) {
      setNewRoute(result);
    } else {
      console.error('Error fetching closest route:', status);
    }
  });
};

function GetRoute() {
  const { routeId } = useParams();
  const [route, setRoute] = useState(null);
  const [locations, setLocations] = useState([]);
  const [directions, setDirections] = useState(null);
  const [busStops, setBusStops] = useState([]);
  const [newRoute, setNewRoute] = useState(null); // Nueva ruta a la parada seleccionada
  const userLocation = useUserLocation();
  const [showTraffic, setShowTraffic] = useState(false);
  const mapRef = useRef(null);
  const trafficLayerRef = useRef(null);
  const { currUser } = useContext(SessionContext);

  useEffect(() => {
    fetchRouteById(routeId)
      .then(data => {
        try {
          const via_waypoints = JSON.parse(data.route.via_waypoints);
          const origin = JSON.parse(data.route.origin);
          const destination = JSON.parse(data.route.destination);
          const busStops = data.route.bus_stops ? JSON.parse(data.route.bus_stops) : [];

          if (origin && destination && Array.isArray(via_waypoints)) {
            setRoute({ ...data.route, origin, destination, via_waypoints });
            setLocations(data.locations);
            setBusStops(busStops);
          } else {
            console.error('Invalid route data:', data);
          }
        } catch (error) {
          console.error('Error parsing route data:', error);
        }
      })
      .catch(error => console.error('Error fetching route details:', error));
  }, [routeId]);

  useEffect(() => {
    if (route && route.origin && route.destination) {
      getDirections(route, setDirections);
    }
  }, [route]);

  useEffect(() => {
    if (mapRef.current) {
      if (showTraffic) {
        if (!trafficLayerRef.current) {
          trafficLayerRef.current = new window.google.maps.TrafficLayer();
        }
        trafficLayerRef.current.setMap(mapRef.current);
      } else {
        if (trafficLayerRef.current) {
          trafficLayerRef.current.setMap(null);
        }
      }
    }
  }, [showTraffic]);

  useEffect(() => {
    const updateLocations = async () => {
      const locationsData = await fetchLocationsByRouteId(routeId);
      setLocations(locationsData);
    };

    updateLocations();
    const intervalId = setInterval(updateLocations, 5000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (currUser && userLocation) {
      const userCurrentLocation = locations.find(
        (loc) => loc.id === currUser.sub && loc.latitude === userLocation.lat && loc.longitude === userLocation.lng
      );

      if (!userCurrentLocation) {
        updateLocation(currUser.sub, {
          latitude: userLocation.lat,
          longitude: userLocation.lng,
        }).catch(console.error);
      }
    }
  }, [currUser, userLocation]);

  return (
    <GetRouteMap
    directions={directions}
    newRoute={newRoute}
    route={route}
    locations={locations}
    busStops={busStops}
    userLocation={userLocation}
    showTraffic={showTraffic}
    mapRef={mapRef}
    setShowTraffic={setShowTraffic}
    onBusStopClick={(busStop) => {
      if (window.confirm(`¿Ver ruta hacia la parada ${busStop.lat}, ${busStop.lng}?`)) {
        getClosestRoute(userLocation, busStop, setNewRoute);
      }
    }}
    onOriginClick={() => {
      if (window.confirm('¿Ver ruta hacia el origen?')) {
        getClosestRoute(userLocation, route.origin, setNewRoute);
      }
    }}
    onDestinationClick={() => {
      if (window.confirm('¿Ver ruta hacia el destino?')) {
        getClosestRoute(userLocation, route.destination, setNewRoute);
      }
    }}
  />
  );
}

export default GetRoute;
