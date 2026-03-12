import { useItinerary } from "../../hooks/useItinerary";
import type { ChecklistItem } from "../../types";

const PRIORITY_CONFIG = {
  critical: {
    label: "🔴 Kritické",
    color: "var(--color-priority-critical)",
    bg: "#FEF2F2",
    border: "#FECACA",
  },
  important: {
    label: "🟠 Důležité",
    color: "var(--color-priority-important)",
    bg: "#FFF7ED",
    border: "#FED7AA",
  },
  info: {
    label: "⚪ Informační",
    color: "var(--color-priority-info)",
    bg: "#F8FAFC",
    border: "#E2E8F0",
  },
};

const PRIORITY_ORDER: ChecklistItem["priority"][] = ["critical", "important", "info"];

function ChecklistRow({
  item,
  onToggle,
}: {
  item: ChecklistItem;
  onToggle: () => void;
}) {
  const cfg = PRIORITY_CONFIG[item.priority];
  return (
    <label
      className="flex items-start gap-3 p-3 cursor-pointer border-b last:border-b-0"
      style={{ borderColor: "#F1F5F9" }}
    >
      <input
        type="checkbox"
        checked={item.done}
        onChange={onToggle}
        className="mt-0.5 w-5 h-5 rounded flex-shrink-0 accent-[var(--color-primary)]"
        style={{ accentColor: cfg.color }}
        aria-label={item.text}
      />
      <span
        className="text-sm leading-relaxed transition-all"
        style={{
          color: item.done ? "var(--color-text-secondary)" : "var(--color-text-primary)",
          textDecoration: item.done ? "line-through" : "none",
          opacity: item.done ? 0.6 : 1,
        }}
      >
        {item.text}
      </span>
    </label>
  );
}

export function ChecklistView() {
  const { state, dispatch } = useItinerary();

  const allDone = state.checklist.every((item) => item.done);

  return (
    <main className="pb-20 lg:pb-8 px-4 pt-4">
      {allDone && state.checklist.length > 0 && (
        <div
          className="mb-4 p-3 rounded-lg text-center text-sm font-medium"
          style={{ backgroundColor: "#F0FDF4", color: "#166534" }}
        >
          Všechno je zaškrtnuté! 🎉
        </div>
      )}

      {PRIORITY_ORDER.map((priority) => {
        const items = state.checklist.filter((i) => i.priority === priority);
        if (items.length === 0) return null;
        const cfg = PRIORITY_CONFIG[priority];

        return (
          <section key={priority} className="mb-4">
            <h2
              className="text-xs font-semibold uppercase tracking-wider mb-2"
              style={{ color: cfg.color }}
            >
              {cfg.label}
            </h2>
            <div
              className="rounded-lg border overflow-hidden bg-white"
              style={{ borderColor: cfg.border, boxShadow: "var(--shadow-card)" }}
            >
              {items.map((item) => (
                <ChecklistRow
                  key={item.id}
                  item={item}
                  onToggle={() =>
                    dispatch({
                      type: "TOGGLE_CHECKLIST",
                      payload: { itemId: item.id },
                    })
                  }
                />
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
}
