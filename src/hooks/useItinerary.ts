import { useContext } from "react";
import { ItineraryContext, type ItineraryContextValue } from "../state/ItineraryContext";

export function useItinerary(): ItineraryContextValue {
  const context = useContext(ItineraryContext);
  if (!context) {
    throw new Error("useItinerary must be used within ItineraryProvider");
  }
  return context;
}
