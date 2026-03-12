import { useState } from "react";
import { useItinerary } from "../../hooks/useItinerary";
import { DaySelector } from "../DaySelector";
import { DayDetail } from "../DayDetail";
import { AddActivityFAB } from "../AddActivityFAB";

interface ProgramViewProps {
  onMoreClick: (dayId: string, activityId: string) => void;
  onAddActivity: (dayId: string) => void;
}

export function ProgramView({ onMoreClick, onAddActivity }: ProgramViewProps) {
  const { state, dispatch } = useItinerary();
  const [selectedDayId, setSelectedDayId] = useState(
    state.days[0]?.id ?? "day-1"
  );

  const selectedDay = state.days.find((d) => d.id === selectedDayId);

  if (state.days.length === 0) {
    return (
      <main className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <span className="text-4xl mb-3">📭</span>
        <p className="text-base font-medium" style={{ color: "var(--color-text-secondary)" }}>
          Žádný program k zobrazení.
        </p>
      </main>
    );
  }

  return (
    <main className="pb-20 lg:pb-8">
      <DaySelector
        days={state.days}
        selectedDayId={selectedDayId}
        onDaySelect={setSelectedDayId}
      />

      {selectedDay ? (
        <DayDetail
          day={selectedDay}
          onMoreClick={(activityId) => onMoreClick(selectedDayId, activityId)}
          onReorder={(activityId, toIndex) =>
            dispatch({
              type: "REORDER_ACTIVITY",
              payload: { dayId: selectedDayId, activityId, toIndex },
            })
          }
        />
      ) : (
        <p
          className="px-4 py-8 text-center text-sm"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Den nenalezen.
        </p>
      )}

      <AddActivityFAB onAdd={() => onAddActivity(selectedDayId)} />
    </main>
  );
}
