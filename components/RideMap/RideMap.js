import axios from "axios";
import { useRouter } from "next/router";
import React from "react";
import { useRef } from "react";
import { useState } from "react";
import { useAppContext } from "../../context/map";

function Map() {
  const mapRef = useRef(null);

  const [driver, setDriver] = useState(null);
  const [route, setRoute] = useState(null);
  const [userState, setUserState] = useState(null);
  const [waitingState, setWaitingState] = useState(false);

  const Router = useRouter();
  const mapState = useAppContext();

  React.useEffect(() => {
    let google = window.google;
    let map = mapRef.current;
    let lat = "0";
    let lng = "0";
    const user = JSON.parse(localStorage.getItem("session"));
    setUserState(user);
    const directionsService = new google.maps.DirectionsService();
    let directionsRenderer = new google.maps.DirectionsRenderer();
    navigator.geolocation.getCurrentPosition((position) => {
      lat = position.coords.latitude;
      lng = position.coords.longitude;

      // Update database with user's current location
      setInterval(() => {
        axios.post("http://localhost:3000/api/updateLocation", {
          params: {
            lat: lat,
            lng: lng,
            id: user.id,
            intent: user.intent,
          },
        });
      }, 5000);

      //Create a map object and specify the DOM element for display.
      const myLatlng = new google.maps.LatLng(lat, lng);

      const mapOptions = {
        zoom: 12,
        center: myLatlng,
        scrollwheel: true,
        zoomControl: true,
        styles: [
          {
            featureType: "administrative",
            elementType: "labels.text.fill",
            stylers: [{ color: "#444444" }],
          },
          {
            featureType: "landscape",
            elementType: "all",
            stylers: [{ color: "#f2f2f2" }],
          },
          {
            featureType: "poi",
            elementType: "all",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "road",
            elementType: "all",
            stylers: [{ saturation: -100 }, { lightness: 45 }],
          },
          {
            featureType: "road.highway",
            elementType: "all",
            stylers: [{ visibility: "simplified" }],
          },
          {
            featureType: "road.arterial",
            elementType: "labels.icon",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "transit",
            elementType: "all",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "water",
            elementType: "all",
            stylers: [{ color: "#cbd5e0" }, { visibility: "on" }],
          },
        ],
      };

      map = new google.maps.Map(map, mapOptions);

      const interval = setInterval(() => {
        axios
          .post("http://localhost:3000/api/checkComplete", {
            params: {
              id: user.id,
            },
          })
          .then((res) => {
            if (res.data[0].continue === "true") {
              clearInterval(interval);
              Router.push("/ridecomplete");
            }
          });
      }, 3000);

      axios
        .post("http://localhost:3000/api/getRideInProgress", {
          params: {
            id: user.id,
          },
        })
        .then((res) => {
          setDriver(res.data[0]);
          const driverLatlng = new google.maps.LatLng(
            res.data[0].lat,
            res.data[0].lng
          );

          console.log(res.data);
          directionsService.route(
            {
              origin: myLatlng,
              destination: driverLatlng,
              travelMode: google.maps.TravelMode.DRIVING,
            },
            (response, status) => {
              if (status === google.maps.DirectionsStatus.OK) {
                directionsRenderer = new google.maps.DirectionsRenderer({
                  map: map,
                  directions: response,
                });
                setRoute(response);
              } else {
                console.error(`error fetching directions ${response}`);
              }
            }
          );
        });
    });
  }, []);

  return (
    <div className="relative w-full rounded h-600-px col-span-2">
      <div className="absolute  z-10 top-[4rem] w-full flex flex-col mx-auto overlay  h-[80%]">
        <div className="w-[50%] max-w-[600px] mx-auto flex overlay__bottom_container hover:-translate-y-1 transition duration-300 ease-out shadow-md hover:shadow-xl active:translate-y-0 active:shadow-sm">
          <button className="bg-black  rounded-[8px] p-4 text-2xl w-full overlay__button drop-shadow-lg ">
            {userState && userState.intent === "rider"
              ? waitingState
                ? `Waiting for ${driver && driver.name}`
                : `Riding with ${driver && driver.name}`
              : `Driving for ${driver && driver.name}`}
          </button>
        </div>
      </div>
      <div id="map" className="rounded h-full" ref={mapRef} />
    </div>
  );
}

export default Map;
