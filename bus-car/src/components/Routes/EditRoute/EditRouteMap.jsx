import React from 'react';
import { GoogleMap, DirectionsRenderer, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100vh',
};

function EditRouteMap({mapCenter, directions, busStops, handleMapLoad, handleMapClick, handleMarkerClick, handleMarkerDragEnd, directionsRendererRef, updateOriginAndDestination, viaWaypoints, setViaWaypoints,}) {
  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={mapCenter}
      zoom={14}
      onLoad={handleMapLoad}
      onClick={handleMapClick}
      options={{ gestureHandling: 'greedy' }}
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

              const newOrigin = {
                lat: directionsRendererRef.current.getDirections().routes[0].legs[0].start_location.lat(),
                lng: directionsRendererRef.current.getDirections().routes[0].legs[0].start_location.lng(),
              };
              const newDestination = {
                lat: directionsRendererRef.current.getDirections().routes[0].legs[0].end_location.lat(),
                lng: directionsRendererRef.current.getDirections().routes[0].legs[0].end_location.lng(),
              };

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
  );
}

export default EditRouteMap;
