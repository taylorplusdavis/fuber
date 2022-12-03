import axios from "axios";
import { useRouter } from "next/router";
import React from "react";
import { useRef } from "react";
import { useState } from "react";
import { useAppContext } from "../../context/map";

function Map() {
  const mapRef = useRef(null);

  const [dropOffAddress, setDropoffAddress] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [route, setRoute] = useState(null);
  const [userState, setUserState] = useState(null);
  const [waitingState, setWaitingState] = useState(false);

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

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
      axios.post("https://fuber.vercel.com/api/updateLocation", {
        params: {
          lat: lat,
          lng: lng,
          id: user.id,
          intent: user.intent,
        },
      });

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

      google.maps.event.addListener(map, "click", function (event) {
        directionsService.route(
          {
            origin: myLatlng,
            destination: event.latLng,
            travelMode: google.maps.TravelMode.DRIVING,
          },
          (response, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
              if (directionsRenderer != null) {
                directionsRenderer.setMap(null);
                directionsRenderer = null;
              }

              directionsRenderer = new google.maps.DirectionsRenderer({
                map: map,
                directions: response,
              });
              setRoute(response);
              setDropoffAddress(response.routes[0].legs[0].end_address);
              setPickupAddress(response.routes[0].legs[0].start_address);
              setRoute(response);
            } else {
              console.error(`error fetching directions ${response}`);
            }
          }
        );
      });
    });
  }, []);

  const handleRequest = () => {
    axios
      .post("https://fuber.vercel.com/api/requestRide", {
        params: {
          id: userState.id,
        },
      })
      .then((res) => {
        console.log(res);

        let accepted = false;
        if (res.data) {
          const interval = setInterval(() => {
            setWaitingState(true);
            console.log("waiting for driver");
            axios
              .post("https://fuber.vercel.com/api/rideStatus", {
                params: {
                  id: userState.id,
                },
              })
              .then((res) => {
                console.log(res);
                if (res.data[0].driver_id !== null) {
                  accepted = true;
                  clearInterval(interval);
                  Router.push("/ride");
                }
              });
          }, 1000);
        }
      });
  };

  return (
    <div className="relative w-full rounded h-600-px col-span-2">
      <div className="absolute  z-10 top-[4rem] w-full flex flex-col mx-auto overlay  h-[80%]">
        {route && (
          <div className="flex flex-col w-full h-full drop-shadow-md">
            <h1 className="text-2xl text-black bg-gray-50 border max-w-[600px] w-[50%] mx-auto p-2 rounded-t-[8px]">
              {pickupAddress
                ? `Pickup Location: ${pickupAddress}`
                : "Pickup Location"}
            </h1>
            <h1 className="text-2xl text-black bg-gray-50 border max-w-[600px] w-[50%] mx-auto p-2 rounded-b-[8px]">
              {dropOffAddress
                ? `Dropoff Location: ${dropOffAddress}`
                : "Dropoff Location"}
            </h1>
          </div>
        )}

        <div
          className="w-[50%] max-w-[600px] mx-auto flex overlay__bottom_container hover:-translate-y-1 transition duration-300 ease-out shadow-md hover:shadow-xl active:translate-y-0 active:shadow-sm"
          onClick={() => handleRequest()}
        >
          <button
            className={`bg-black  rounded-l-[8px] p-4 text-2xl w-full overlay__button drop-shadow-lg  ${
              !route && "rounded-r-[8px]"
            }`}
          >
            {waitingState
              ? "Waiting for driver..."
              : route
              ? "Request Fuber"
              : "Select Dropoff Location"}
          </button>

          {route && (
            <div className="bg-white rounded-r-[8px] w-[7rem] flex flex-col justify-center h-[90px]">
              <p className=" text-black font-bold text-center text-xl">
                {route.routes[0].legs[0].distance.text}
              </p>
              <p className="text-black font-bold text-center text-xl ">
                {route.routes[0].legs[0].duration.text}
              </p>
              <p className="text-black font-bold text-center text-xl ">
                {formatter.format(
                  (parseInt(route.routes[0].legs[0].distance.text) + 4) * 1.87
                )}
              </p>
            </div>
          )}
        </div>
      </div>
      <div id="map" className="rounded h-full" ref={mapRef} />
    </div>
  );
}

export default Map;
