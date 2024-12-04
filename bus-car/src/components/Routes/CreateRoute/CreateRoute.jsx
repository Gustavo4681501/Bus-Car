import React, { useState, useEffect, useRef, useContext } from "react";
import { saveRoute } from "../../../api/routeApi";
import CreateRouteMap from "./CreateRouteMap";
import useUserLocation from "./../../Location/useUserLocation"; 
import { SessionContext } from "../../Auth/Authentication/SessionContext";

function CreateRoute() {
  const [name, setName] = useState("");
  const [directions, setDirections] = useState(null);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [addingBusStops, setAddingBusStops] = useState(false);
  const [busStops, setBusStops] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const mapRef = useRef();
  const directionsRendererRef = useRef();
  const directionsService = useRef(new window.google.maps.DirectionsService());
  const autocompleteOriginRef = useRef();
  const autocompleteDestinationRef = useRef();
  const userLocation = useUserLocation();
  const { currUser } = useContext(SessionContext);

  useEffect(() => {
    if (userLocation && mapRef.current) {
      mapRef.current.setCenter(userLocation);
    }
  }, [userLocation]);

  useEffect(() => {
    if (origin && destination) {
      const request = {
        origin,
        destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
        unitSystem: window.google.maps.UnitSystem.METRIC,
      };

      directionsService.current.route(request, (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error(`Error fetching directions: ${status}`);
        }
      });
    }
  }, [origin, destination]);

  const handleMapLoad = (mapInstance) => {
    mapRef.current = mapInstance;

    const initAutocomplete = (ref, setPlace) => {
      const autocomplete = new window.google.maps.places.Autocomplete(ref.current);
      autocomplete.bindTo("bounds", mapInstance);
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        setPlace(place.formatted_address);
      });
    };

    initAutocomplete(autocompleteOriginRef, setOrigin);
    initAutocomplete(autocompleteDestinationRef, setDestination);
  };

  const handleMapClick = (e) => {
    if (addingBusStops) {
      const newStop = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      setBusStops([...busStops, newStop]);
    }
  };

  const handleMarkerDragEnd = (e, index, remove = false) => {
    const newBusStops = [...busStops];
    if (remove) {
      newBusStops.splice(index, 1);
    } else if (e) {
      const newPosition = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      newBusStops[index] = newPosition;
    }
    setBusStops(newBusStops);
  };

  const toggleAddBusStops = () => {
    setAddingBusStops(!addingBusStops);
  };

  const handleSaveRoute = () => {
    const updatedDirections = directionsRendererRef.current?.getDirections();
    if (updatedDirections) {
      const { start_location, end_location, via_waypoints } = updatedDirections.routes[0].legs[0];
      const points = {
        name: name,
        origin: { lat: start_location.lat(), lng: start_location.lng() },
        destination: { lat: end_location.lat(), lng: end_location.lng() },
        via_waypoints: via_waypoints.map((wp) => ({ lat: wp.lat(), lng: wp.lng() })),
        bus_stops: busStops,
        user_id: currUser ? currUser.sub : null,
      };

      saveRoute(points)
        .then((response) => {
          setSuccessMessage("Ruta guardada correctamente");
          setName("");
          setOrigin("");
          setDestination("");
          setBusStops([]);
          setDirections(null);

          setTimeout(() => {
            setSuccessMessage(null);
          }, 3000);
        })
        .catch((error) => {
          setErrorMessage("Error al guardar la ruta. Por favor, intenta de nuevo.");
          console.error("Error saving route:", error);

          setTimeout(() => {
            setErrorMessage(null);
          }, 3000);
        });
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Crear Ruta</h2>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      
      <div className="form-group">
        <span>Nombre de la Ruta</span>
        <input
          className="form-control mb-2"
          type="text"
          placeholder="Introduce el nombre de la ruta"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="form-group d-flex gap-3">
        <div>
          <span>Origen</span>
          <input
            ref={autocompleteOriginRef}
            className="form-control"
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
          />
        </div>
        <div>
          <span>Destino</span>
          <input
            ref={autocompleteDestinationRef}
            className="form-control"
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>
      </div>
      <div className="form-group">
        <button className="btn btn-success m-2" onClick={handleSaveRoute}>
          Guardar Ruta
        </button>
        <button className="btn btn-warning m-2" onClick={toggleAddBusStops}>
          {addingBusStops ? "Desactivar Paradas de Buses" : "Activar Paradas de Buses"}
        </button>
      </div>
      <CreateRouteMap
        mapOptions={{ disableDefaultUI: true, gestureHandling: "greedy" }}
        directions={directions}
        userLocation={userLocation}
        handleMapLoad={handleMapLoad}
        onDirectionsLoad={(ref) => {
          directionsRendererRef.current = ref;
        }}
        busStops={busStops}
        onMapClick={handleMapClick}
        onMarkerDragEnd={handleMarkerDragEnd}
      />
    </div>
  );
}

export default CreateRoute;
