import Head from "next/head";
import React from "react";
import RideMap from "../../components/RideMap/RideMap";

function index() {
  return (
    <div className="grid grid-cols-2 h-screen">
      <Head>
        <title>Fuber | Ride</title>
        {typeof google === "undefined" && (
          <script
            src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
          ></script>
        )}
        ;
      </Head>
      <RideMap />
    </div>
  );
}

export default index;
