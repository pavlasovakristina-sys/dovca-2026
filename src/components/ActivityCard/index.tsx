import { useState } from "react";
import type { Activity } from "../../types";

interface ActivityCardProps {
  activity: Activity;
  onMoreClick: (id: string) => void;
  dragHandle?: React.ReactNode;
  isDragging?: boolean;
}

const TYPE_ICONS: Record<Activity["type"], string> = {
  travel: "🚗",
  sight: "👁️",
  food: "🍽️",
  beach: "🏖️",
  activity: "🎯",
  free: "☀️",
};

const TYPE_COLORS: Record<Activity["type"], string> = {
  travel: "#94A3B8",
  sight: "#3B82F6",
  food: "#F97316",
  beach: "#06B6D4",
  activity: "#8B5CF6",
  free: "#22C55E",
};

export function ActivityCard({
  activity,
  onMoreClick,
  dragHandle,
  isDragging = false,
}: ActivityCardProps) {
  const [expanded, setExpanded] = useState(false);

  const totalTips = activity.tips ?? [];
  const hasDetails =
    activity.description ||
    totalTips.length > 0 ||
    activity.important ||
    activity.price;

  return (
    <article
      role="article"
      aria-expanded={expanded}
      className="rounded-lg border bg-white transition-all"
      style={{
        boxShadow: isDragging ? "var(--shadow-elevated)" : "var(--shadow-card)",
        opacity: isDragging ? 0.5 : 1,
        transform: isDragging ? "scale(1.02)" : "scale(1)",
        borderColor: "#E2E8F0",
      }}
    >
      {/* Collapsed row */}
      <div className="flex items-center gap-0">
        <button
          className="flex-1 flex items-center gap-3 px-3 py-3 text-left min-h-[44px]"
          onClick={() => hasDetails && setExpanded((v) => !v)}
          aria-label={`${activity.time} – ${activity.title}${expanded ? ", sbalit" : ", rozbalit"}`}
        >
          {/* Drag handle */}
          {dragHandle && (
            <span className="flex-shrink-0 text-slate-300 cursor-grab active:cursor-grabbing w-5 flex items-center justify-center">
              {dragHandle}
            </span>
          )}

          {/* Type icon */}
          <span
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-base"
            style={{ backgroundColor: `${TYPE_COLORS[activity.type]}20` }}
            aria-hidden="true"
          >
            {TYPE_ICONS[activity.type]}
          </span>

          {/* Time */}
          <span
            className="flex-shrink-0 text-sm font-mono font-medium w-11"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {activity.time}
          </span>

          {/* Title */}
          <span
            className="flex-1 text-base font-medium leading-tight"
            style={{ color: "var(--color-text-primary)" }}
          >
            {activity.title}
          </span>

          {/* Drive badge */}
          {activity.driveFromPrevious && (
            <span
              className="flex-shrink-0 text-xs px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: "#F1F5F9",
                color: "var(--color-text-secondary)",
              }}
            >
              🚗 {activity.driveFromPrevious.minutes} min
            </span>
          )}

          {/* Expand chevron */}
          {hasDetails && (
            <span
              className="flex-shrink-0 text-xs transition-transform"
              style={{
                color: "var(--color-text-secondary)",
                transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              }}
              aria-hidden="true"
            >
              ▾
            </span>
          )}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onMoreClick(activity.id);
          }}
          className="flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-full text-sm font-medium"
          style={{ color: "var(--color-text-secondary)" }}
          aria-label="Více možností"
        >
          ⋯
        </button>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-3 border-t" style={{ borderColor: "#F1F5F9" }}>
          {/* Description */}
          {activity.description && (
            <p
              className="mt-2 text-sm leading-relaxed"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {activity.description}
            </p>
          )}

          {/* Important badge */}
          {activity.important && (
            <div
              className="mt-2 flex gap-2 p-2 rounded-md text-sm"
              style={{
                backgroundColor: "#FEF2F2",
                borderColor: "#FECACA",
                border: "1px solid",
                color: "#991B1B",
              }}
            >
              <span aria-hidden="true">⚠️</span>
              <span>{activity.important}</span>
            </div>
          )}

          {/* Tips */}
          {totalTips.length > 0 && (
            <ul className="mt-2 space-y-1">
              {totalTips.map((tip, i) => (
                <li
                  key={i}
                  className="text-sm flex gap-1.5"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  <span aria-hidden="true">💡</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Price */}
          {activity.price && (
            <div className="mt-2 flex items-center gap-1.5">
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ backgroundColor: "#F0FDF4", color: "#166534" }}
              >
                €{activity.price.amount}
              </span>
              {activity.price.note && (
                <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                  {activity.price.note}
                </span>
              )}
            </div>
          )}

        </div>
      )}
    </article>
  );
}
