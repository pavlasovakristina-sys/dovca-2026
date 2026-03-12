import { useReducer, useEffect, type ReactNode } from "react";
import { ItineraryContext } from "./ItineraryContext";
import { itineraryReducer } from "./reducer";
import { loadInitialState, persistState } from "./storage";

export function ItineraryProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(
    itineraryReducer,
    undefined,
    loadInitialState
  );

  useEffect(() => {
    persistState(state);
  }, [state]);

  return (
    <ItineraryContext.Provider value={{ state, dispatch }}>
      {children}
    </ItineraryContext.Provider>
  );
}
