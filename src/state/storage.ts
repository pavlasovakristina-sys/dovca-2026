import type { ItineraryData } from "../types";
import defaultData from "../data/itinerary.json";

const STORAGE_KEY = "dovca-2026-state";

export function loadInitialState(): ItineraryData {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed: unknown = JSON.parse(stored);
      if (
        parsed !== null &&
        typeof parsed === "object" &&
        "days" in parsed &&
        Array.isArray((parsed as Record<string, unknown>).days)
      ) {
        return parsed as ItineraryData;
      }
    } catch {
      // corrupted — fallback to default
    }
  }
  return defaultData as ItineraryData;
}

export function persistState(state: ItineraryData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage full — ignore silently (toast handled upstream)
  }
}
