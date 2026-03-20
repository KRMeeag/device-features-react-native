import { useContext, createContext, ReactNode } from "react";
import { useTravelLogs } from "../hooks/useTravelLogs";
import { TravelEntry } from "../types";

const TravelContext = createContext<
  ReturnType<typeof useTravelLogs> | undefined
>(undefined);

export const TravelProvider = ({ children }: { children: ReactNode }) => {
  const travelUtils = useTravelLogs();

  return (
    <TravelContext.Provider value={travelUtils}>
      {children}
    </TravelContext.Provider>
  );
};

export const useTravelInfo = () => {
  const context = useContext(TravelContext);
  if (!context)
    throw new Error("useTravelInfo must be used within a TravelProvider!");

  return context;
};
