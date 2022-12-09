import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

function index() {
  const [user, setUser] = useState({});
  const [rides, setRides] = useState([]);
  const [driving, setDriving] = useState(false);
  const [rideId, setRideId] = useState("");
  const Router = useRouter();

  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("session"));
    setUser(JSON.parse(localStorage.getItem("session")));

    const isOpenRide = () => {
      axios
        .post("https://fuber.vercel.app/api/checkOpenRide", {
          params: {
            id: user.id,
          },
        })
        .then((res) => {
          console.log(res);
          if (res.data.length > 0 && res.data[0] !== false) {
            setDriving(true);
            setRideId((prev) => res.data[0].id);
          }
        });
    };
    isOpenRide();

    let lat, lng;

    navigator.geolocation.getCurrentPosition((position) => {
      lat = position.coords.latitude;
      lng = position.coords.longitude;

      // Update database with user's current location
      setInterval(() => {
        axios.post("https://fuber.vercel.app/api/updateLocation", {
          params: {
            lat: lat,
            lng: lng,
            id: user.id,
          },
        });
      }, 5000);
    });

    const interval = setInterval(() => {
      axios.post("https://fuber.vercel.app/api/getOpenRides").then((res) => {
        setRides(res.data);
      });
    }, 1000);
  }, []);

  const handleAcceptRide = (rideId) => {
    axios
      .post("https://fuber.vercel.app/api/acceptRide", {
        params: {
          driverId: user.id,
          rideId: rideId,
        },
      })
      .then((res) => {
        setDriving(true);
        setRideId(rideId);
      });
  };

  const handleDropoff = () => {
    axios
      .post("https://fuber.vercel.app/api/dropoff", {
        params: {
          rideId: rideId,
        },
      })
      .then((res) => {
        setDriving(false);
        setRideId("");
        Router.push("/ridecomplete");
      });
  };

  return (
    <div className="flex flex-col mt-[5%]">
      <h1 className="text-center text-[4rem]">Driver Dashboard</h1>
      <div className="bg-white text-black w-[66%] mx-auto rounded-[8px] p-4">
        {!driving ? (
          <div className="flex flex-col">
            <h1 className="text-3xl text-black">Current Rides</h1>
            {rides.map((ride) => (
              <div
                className="flex flex-row justify-between items-center"
                key={ride.id}
              >
                <div className="flex flex-row justify-between text-black text-xl font-bold">
                  Rider with ID {ride.rider_id} would like a ride.
                </div>
                <button
                  className="bg-black text-white rounded-[8px] p-2"
                  onClick={() => handleAcceptRide(ride.id)}
                >
                  Accept
                </button>
              </div>
            ))}
          </div>
        ) : (
          <button
            className="bg-black text-white rounded-[8px] p-2"
            onClick={() => handleDropoff()}
          >
            Dropoff
          </button>
        )}
      </div>
    </div>
  );
}

export default index;
