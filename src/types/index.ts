export interface ItineraryData {
  meta: Meta;
  days: Day[];
  checklist: ChecklistItem[];
}

export interface Meta {
  title: string;
  dateRange: {
    start: string;
    end: string;
  };
  participants: number;
  accommodation: Accommodation;
  cars: Car[];
  flights: Flight[];
}

export interface Accommodation {
  name: string;
  location: string;
  address: string;
  dates: { checkIn: string; checkOut: string };
  checkInTime: string;
  checkOutTime: string;
  phone: string;
  coordinates: { lat: number; lng: number };
}

export interface Car {
  id: string;
  reservation: string;
  model: string;
  driver: string;
  dates: { pickup: string; return: string };
}

export interface Flight {
  id: string;
  booking: string;
  airline: string;
  flightNumber: string;
  route: { from: string; to: string };
  date: string;
  departure: string;
  duration: string;
  baggage: string;
}

export interface Day {
  id: string;
  date: string;
  dayNumber: number;
  theme: string;
  difficulty: "lehký" | "střední" | "náročný";
  activities: Activity[];
}

export interface Activity {
  id: string;
  time: string;
  endTime?: string;
  title: string;
  description: string;
  location: {
    name: string;
    lat: number;
    lng: number;
  };
  type: "travel" | "sight" | "food" | "beach" | "activity" | "free";
  driveFromPrevious?: {
    minutes: number;
    km?: number;
  } | null;
  tips?: string[];
  price?: {
    amount: number;
    currency: "EUR";
    note?: string;
  };
  important?: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  priority: "critical" | "important" | "info";
  done: boolean;
}

export type ActiveView = "program" | "map" | "itinerary" | "checklist";

export type ItineraryAction =
  | { type: "ADD_ACTIVITY"; payload: { dayId: string; activity: Activity } }
  | { type: "UPDATE_ACTIVITY"; payload: { dayId: string; activity: Activity } }
  | { type: "REMOVE_ACTIVITY"; payload: { dayId: string; activityId: string } }
  | {
      type: "MOVE_ACTIVITY";
      payload: {
        fromDayId: string;
        toDayId: string;
        activityId: string;
        toIndex: number;
      };
    }
  | {
      type: "REORDER_ACTIVITY";
      payload: { dayId: string; activityId: string; toIndex: number };
    }
  | { type: "TOGGLE_CHECKLIST"; payload: { itemId: string } }
  | { type: "RESET" }
  | { type: "IMPORT"; payload: { data: ItineraryData } };
