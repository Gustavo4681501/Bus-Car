import React, { useEffect, useState, useRef, useContext } from 'react'; 
import { useParams } from 'react-router-dom';
import { fetchRouteById } from '../../../api/routeApi';
import GetRouteMap from './GetRouteMap';
import useUserLocation from './../../Location/useUserLocation'; // Importar el hook
import { fetchLocations } from '../../../api/locationApi';
import { SessionContext } from '../../Auth/Authentication/SessionContext';
import {updateLocation } from '../../../api/locationApi';

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

function GetRoute() {
  const { routeId } = useParams();
  const [route, setRoute] = useState(null);
  const [locations, setLocations] = useState([]);
  const [directions, setDirections] = useState(null);
  const [busStops, setBusStops] = useState([]);
  const userLocation = useUserLocation(); // Usar el hook para la ubicación del usuario
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

   // Fetch de ubicaciones de otros usuarios
   useEffect(() => {
    const updateLocations = async () => {
      const locationsData = await fetchLocations(); // Usar la función fetchLocations
      setLocations(locationsData);
    };

    updateLocations();
    const intervalId = setInterval(updateLocations, 5000); // Actualiza cada 5 segundos

    return () => clearInterval(intervalId);
  }, []);

  // useEffect(() => {
  //   if (currUser && userLocation) {
  //     if (!locations || locations.latitude !== userLocation.lat || locations.longitude !== userLocation.lng) {
  //       updateLocation(currUser.sub, {
  //         latitude: userLocation.lat,
  //         longitude: userLocation.lng
  //       }).then(updatedLocation => {
  //         setLocations(updatedLocation);
  //       })
  //         .catch(console.error);
  //     }
  //   }
  // }, [currUser, userLocation]);

  return (
    <GetRouteMap
      directions={directions}
      route={route}
      locations={locations}
      busStops={busStops}
      userLocation={userLocation}
      showTraffic={showTraffic}
      mapRef={mapRef}
      setShowTraffic={setShowTraffic}
    />
  );
}

export default GetRoute;
