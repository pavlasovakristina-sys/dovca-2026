import type { ItineraryData, ItineraryAction } from "../types";
import defaultData from "../data/itinerary.json";

export function itineraryReducer(
  state: ItineraryData,
  action: ItineraryAction
): ItineraryData {
  switch (action.type) {
    case "ADD_ACTIVITY": {
      return {
        ...state,
        days: state.days.map((day) =>
          day.id === action.payload.dayId
            ? { ...day, activities: [...day.activities, action.payload.activity] }
            : day
        ),
      };
    }

    case "UPDATE_ACTIVITY": {
      return {
        ...state,
        days: state.days.map((day) =>
          day.id === action.payload.dayId
            ? {
                ...day,
                activities: day.activities.map((a) =>
                  a.id === action.payload.activity.id ? action.payload.activity : a
                ),
              }
            : day
        ),
      };
    }

    case "REMOVE_ACTIVITY": {
      return {
        ...state,
        days: state.days.map((day) =>
          day.id === action.payload.dayId
            ? {
                ...day,
                activities: day.activities.filter(
                  (a) => a.id !== action.payload.activityId
                ),
              }
            : day
        ),
      };
    }

    case "MOVE_ACTIVITY": {
      const { fromDayId, toDayId, activityId, toIndex } = action.payload;
      let moved = null as (typeof state.days)[0]["activities"][0] | null;

      const withRemoved = state.days.map((day) => {
        if (day.id === fromDayId) {
          const activity = day.activities.find((a) => a.id === activityId);
          if (activity) moved = activity;
          return {
            ...day,
            activities: day.activities.filter((a) => a.id !== activityId),
          };
        }
        return day;
      });

      if (!moved) return state;
      const movedActivity = moved;

      return {
        ...state,
        days: withRemoved.map((day) => {
          if (day.id === toDayId) {
            const activities = [...day.activities];
            activities.splice(toIndex, 0, movedActivity);
            return { ...day, activities };
          }
          return day;
        }),
      };
    }

    case "REORDER_ACTIVITY": {
      const { dayId, activityId, toIndex } = action.payload;
      return {
        ...state,
        days: state.days.map((day) => {
          if (day.id !== dayId) return day;
          const activities = [...day.activities];
          const fromIndex = activities.findIndex((a) => a.id === activityId);
          if (fromIndex === -1) return day;
          const [item] = activities.splice(fromIndex, 1);
          activities.splice(toIndex, 0, item);
          return { ...day, activities };
        }),
      };
    }

    case "TOGGLE_CHECKLIST": {
      return {
        ...state,
        checklist: state.checklist.map((item) =>
          item.id === action.payload.itemId
            ? { ...item, done: !item.done }
            : item
        ),
      };
    }

    case "RESET": {
      localStorage.removeItem("dovca-2026-state");
      return defaultData as ItineraryData;
    }

    case "IMPORT": {
      return action.payload.data;
    }

    default:
      return state;
  }
}
