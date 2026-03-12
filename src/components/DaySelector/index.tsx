import type { Day } from "../../types";

interface DaySelectorProps {
  days: Day[];
  selectedDayId: string;
  onDaySelect: (dayId: string) => void;
}

const WEEKDAYS = ["Ne", "Po", "Út", "St", "Čt", "Pá", "So"];

function getDayLabel(day: Day): string {
  const weekday = WEEKDAYS[new Date(day.date).getDay()];
  return `${day.dayNumber}·${weekday}`;
}

export function DaySelector({ days, selectedDayId, onDaySelect }: DaySelectorProps) {
  function handleKeyDown(e: React.KeyboardEvent, currentIndex: number) {
    if (e.key === "ArrowRight") {
      const next = days[Math.min(currentIndex + 1, days.length - 1)];
      if (next) onDaySelect(next.id);
    } else if (e.key === "ArrowLeft") {
      const prev = days[Math.max(currentIndex - 1, 0)];
      if (prev) onDaySelect(prev.id);
    }
  }

  return (
    <div
      role="tablist"
      aria-label="Výběr dne"
      className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide snap-x"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      {days.map((day, i) => {
        const isActive = day.id === selectedDayId;
        return (
          <button
            key={day.id}
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onDaySelect(day.id)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            className="flex-shrink-0 snap-start px-4 h-10 rounded-full text-sm font-medium transition-all min-w-[60px] border"
            style={
              isActive
                ? {
                    backgroundColor: "var(--color-primary)",
                    color: "var(--color-text-inverse)",
                    borderColor: "var(--color-primary)",
                    boxShadow: "var(--shadow-card)",
                  }
                : {
                    backgroundColor: "var(--color-surface)",
                    color: "var(--color-text-secondary)",
                    borderColor: "#E2E8F0",
                  }
            }
          >
            {getDayLabel(day)}
          </button>
        );
      })}
    </div>
  );
}
