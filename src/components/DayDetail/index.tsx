import type { Day } from "../../types";
import { ActivityList } from "../ActivityList";

interface DayDetailProps {
  day: Day;
  onMoreClick: (activityId: string) => void;
  onReorder: (activityId: string, toIndex: number) => void;
}

const DIFFICULTY_COLORS = {
  lehký: "var(--color-difficulty-easy)",
  střední: "var(--color-difficulty-medium)",
  náročný: "var(--color-difficulty-hard)",
};

const DIFFICULTY_LABELS = {
  lehký: "🟢 lehký",
  střední: "🟡 střední",
  náročný: "🔴 náročný",
};

function getTotalDriveMinutes(day: Day): number {
  return day.activities.reduce((sum, a) => {
    return sum + (a.driveFromPrevious?.minutes ?? 0);
  }, 0);
}

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("cs-CZ", {
    weekday: "long",
    day: "numeric",
    month: "numeric",
  });
}

export function DayDetail({ day, onMoreClick, onReorder }: DayDetailProps) {
  const totalDrive = getTotalDriveMinutes(day);

  return (
    <div>
      {/* Day summary */}
      <div
        className="mx-4 mt-2 mb-3 p-3 rounded-lg border"
        style={{ backgroundColor: "var(--color-surface)", borderColor: "#E2E8F0" }}
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2
              className="text-lg font-semibold leading-tight"
              style={{ color: "var(--color-text-primary)" }}
            >
              {day.dayNumber === 0 ? `B-plán — ${day.theme}` : `Den ${day.dayNumber} — ${day.theme}`}
            </h2>
            {day.dayNumber !== 0 && (
              <p className="text-sm mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
                {formatDate(day.date)}
              </p>
            )}
            {day.dayNumber === 0 && (
              <p className="text-sm mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
                Náhradní program pro deštivý den
              </p>
            )}
          </div>
          <div className="flex flex-col items-end gap-1">
            <span
              className="text-xs font-medium"
              style={{ color: DIFFICULTY_COLORS[day.difficulty] }}
            >
              {DIFFICULTY_LABELS[day.difficulty]}
            </span>
            {totalDrive > 0 && (
              <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                🚗 {totalDrive} min celkem
              </span>
            )}
          </div>
        </div>
      </div>

      <ActivityList
        activities={day.activities}
        dayId={day.id}
        onMoreClick={onMoreClick}
        onReorder={onReorder}
      />
    </div>
  );
}
