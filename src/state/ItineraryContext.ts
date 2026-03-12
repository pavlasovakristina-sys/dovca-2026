import { createContext } from "react";
import type { ItineraryData, ItineraryAction } from "../types";

export interface ItineraryContextValue {
  state: ItineraryData;
  dispatch: React.Dispatch<ItineraryAction>;
}

export const ItineraryContext = createContext<ItineraryContextValue | undefined>(
  undefined
);
