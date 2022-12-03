import { createContext, useContext } from "react";

const AppContext = createContext();

export function AppWrapper({ children }) {
  let map;

  map = {
    currCoords: {},
    pickupCoords: {},
    dropoffCoords: {},
    setCurrCoords: (coords) => {
      map.currCoords = coords;
    },
    setPickupCoords: (coords) => {
      map.pickupCoords = coords;
    },
    setDropoffCoords: (coords) => {
      map.dropoffCoords = coords;
    },
  };

  return <AppContext.Provider value={map}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  return useContext(AppContext);
}
