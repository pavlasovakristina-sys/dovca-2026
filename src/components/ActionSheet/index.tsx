import { useState, useEffect, useRef, useCallback } from "react";
import type { Day } from "../../types";
import { useFocusTrap } from "../../hooks/useFocusTrap";

interface ActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onMoveTo: (dayId: string) => void;
  days: Day[];
  currentDayId: string;
}

export function ActionSheet({
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onMoveTo,
  days,
  currentDayId,
}: ActionSheetProps) {
  const [movingMode, setMovingMode] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useFocusTrap(panelRef, isOpen);

  // Reset movingMode on close — in handler, not effect
  const handleClose = useCallback(() => {
    setMovingMode(false);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  const otherDays = days.filter((d) => d.id !== currentDayId);

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center"
      aria-modal="true"
      role="dialog"
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        className="relative z-10 w-full max-w-lg rounded-t-2xl bg-white"
        style={{ boxShadow: "var(--shadow-modal)", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        {!movingMode ? (
          <div className="py-2">
            <button
              onClick={() => { onEdit(); handleClose(); }}
              className="w-full flex items-center gap-3 px-5 py-4 text-base text-left min-h-[56px] hover:bg-slate-50"
              style={{ color: "var(--color-text-primary)" }}
            >
              <span>✏️</span>
              <span>Upravit</span>
            </button>
            <div style={{ borderTop: "1px solid #F1F5F9" }} />
            <button
              onClick={() => setMovingMode(true)}
              className="w-full flex items-center gap-3 px-5 py-4 text-base text-left min-h-[56px] hover:bg-slate-50"
              style={{ color: "var(--color-text-primary)" }}
              disabled={otherDays.length === 0}
            >
              <span>📁</span>
              <span>Přesunout na den...</span>
            </button>
            <div style={{ borderTop: "1px solid #F1F5F9" }} />
            <button
              onClick={() => { onDelete(); handleClose(); }}
              className="w-full flex items-center gap-3 px-5 py-4 text-base text-left min-h-[56px] hover:bg-red-50"
              style={{ color: "#EF4444" }}
            >
              <span>🗑️</span>
              <span>Smazat</span>
            </button>
            <div style={{ borderTop: "1px solid #F1F5F9" }} />
            <button
              onClick={handleClose}
              className="w-full px-5 py-4 text-base font-medium min-h-[56px] hover:bg-slate-50"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Zrušit
            </button>
          </div>
        ) : (
          <div className="py-2">
            <p
              className="px-5 py-3 text-sm font-medium"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Přesunout na den:
            </p>
            {otherDays.map((day) => (
              <button
                key={day.id}
                onClick={() => { onMoveTo(day.id); handleClose(); }}
                className="w-full flex items-center gap-3 px-5 py-4 text-base text-left min-h-[56px] hover:bg-slate-50"
                style={{ color: "var(--color-text-primary)" }}
              >
                <span className="font-medium">Den {day.dayNumber}</span>
                <span style={{ color: "var(--color-text-secondary)" }}>— {day.theme}</span>
              </button>
            ))}
            <div style={{ borderTop: "1px solid #F1F5F9" }} />
            <button
              onClick={() => setMovingMode(false)}
              className="w-full px-5 py-4 text-base font-medium min-h-[56px] hover:bg-slate-50"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Zpět
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
