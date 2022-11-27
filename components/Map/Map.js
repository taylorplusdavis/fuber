import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import axios from "axios";
import React, { useState, useEffect } from "react";

const handleSetMarkers = (e) => {};

function Map() {
  const [location, setLocation] = useState({});
  const [markers, setMarkers] = useState({
    pickup: { lat: null, lng: null },
    dropoff: { lat: null, lng: null },
  });
  const [user, setUser] = useState();

  const handleSetMarkers = (e) => {
    if (markers.pickup.lat === null) {
      setMarkers({
        ...markers,
        pickup: { lat: e.latLng.lat(), lng: e.latLng.lng() },
      });
    } else if (markers.dropoff.lat === null) {
      setMarkers({
        ...markers,
        dropoff: { lat: e.latLng.lat(), lng: e.latLng.lng() },
      });
    } else {
      setMarkers({
        pickup: { lat: e.latLng.lat(), lng: e.latLng.lng() },
        dropoff: { lat: null, lng: null },
      });
    }
  };

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("session")));
    let data = JSON.parse(localStorage.getItem("session"));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });

        axios.post("http://localhost:3002/api/updateLocation", {
          params: {
            id: data.id,
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
            intent: data.intent,
          },
        });
      },
      null,
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }, []);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  if (!isLoaded) return "Loading...";
  return (
    <GoogleMap
      zoom={10}
      center={location}
      mapContainerClassName="map__container"
      onClick={(e) => handleSetMarkers(e)}
    >
      <Marker position={markers.pickup} />
      <Marker position={markers.dropoff} />
      <button className="map__button">Current Location</button>
    </GoogleMap>
  );
}

export default Map;
