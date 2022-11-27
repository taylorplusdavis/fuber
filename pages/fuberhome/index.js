import React, { useState, useEffect } from "react";
import Map from "../../components/Map/Map";
import Sidebar from "../../components/Sidebar/Sidebar";

function welcomeriderpage() {
  const [user, setUser] = useState({});
  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("session")));
  }, []);

  return (
    <div className="grid grid-cols-2 h-screen">
      <Sidebar />
      <Map />
    </div>
  );
}

export default welcomeriderpage;
