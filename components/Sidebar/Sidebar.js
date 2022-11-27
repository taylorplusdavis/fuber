import React, { useEffect, useState } from "react";

function Sidebar() {
  const [user, setUser] = useState({});
  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("session")));
  }, []);

  return (
    <div className="">
      <p>Hello {user.name}</p>
    </div>
  );
}

export default Sidebar;
