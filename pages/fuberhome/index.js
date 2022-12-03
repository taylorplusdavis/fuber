import Head from "next/head";
import Script from "next/script";
import React, { useState, useEffect } from "react";
import Map from "../../components/Map/Map";
import Sidebar from "../../components/Sidebar/Sidebar";

function welcomeriderpage() {
  const [user, setUser] = useState({});
  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("session")));
  }, []);

  return (
    <div className="grid grid-cols-3 h-screen">
      <Head>
        <title>Fuber | Home</title>
        {typeof google === "undefined" && (
          <script
            src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
          ></script>
        )}
        ;
      </Head>
      <Sidebar />
      <Map />
    </div>
  );
}

export default welcomeriderpage;
