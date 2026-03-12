import { useState, useEffect, useRef } from "react";
import type { Activity } from "../../types";
import { useFocusTrap } from "../../hooks/useFocusTrap";

interface EditModalProps {
  activity?: Activity;
  dayId: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (activity: Activity) => void;
}

const ACTIVITY_TYPES: { value: Activity["type"]; label: string; icon: string }[] = [
  { value: "sight", label: "Místo", icon: "👁️" },
  { value: "food", label: "Jídlo", icon: "🍽️" },
  { value: "beach", label: "Pláž", icon: "🏖️" },
  { value: "activity", label: "Aktivita", icon: "🎯" },
  { value: "travel", label: "Cesta", icon: "🚗" },
  { value: "free", label: "Volno", icon: "☀️" },
];

const TYPE_COLORS: Record<Activity["type"], string> = {
  travel: "#94A3B8",
  sight: "#3B82F6",
  food: "#F97316",
  beach: "#06B6D4",
  activity: "#8B5CF6",
  free: "#22C55E",
};

function generateId(): string {
  return `activity-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function EditModal({ activity, isOpen, onClose, onSave }: EditModalProps) {
  const [time, setTime] = useState(activity?.time ?? "");
  const [title, setTitle] = useState(activity?.title ?? "");
  const [type, setType] = useState<Activity["type"]>(activity?.type ?? "sight");
  const [description, setDescription] = useState(activity?.description ?? "");
  const [locationName, setLocationName] = useState(activity?.location.name ?? "");
  const [important, setImportant] = useState(activity?.important ?? "");
  const [errors, setErrors] = useState<{ time?: string; title?: string }>({});

  const firstFieldRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useFocusTrap(panelRef, isOpen);

  useEffect(() => {
    if (!isOpen) return;
    setTimeout(() => firstFieldRef.current?.focus(), 50);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  function validate(): boolean {
    const newErrors: typeof errors = {};
    if (!time.trim()) newErrors.time = "Čas je povinný";
    if (!title.trim()) newErrors.title = "Název aktivity je povinný";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    const saved: Activity = {
      id: activity?.id ?? generateId(),
      time: time.trim(),
      title: title.trim(),
      type,
      description: description.trim(),
      location: {
        name: locationName.trim() || title.trim(),
        lat: activity?.location.lat ?? 0,
        lng: activity?.location.lng ?? 0,
      },
      important: important.trim() || undefined,
      tips: activity?.tips,
      price: activity?.price,
      driveFromPrevious: activity?.driveFromPrevious,
    };
    onSave(saved);
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end lg:items-center justify-center"
      aria-modal="true"
      role="dialog"
      aria-label={activity ? "Upravit aktivitu" : "Nová aktivita"}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div
        ref={panelRef}
        className="relative z-10 w-full lg:max-w-lg rounded-t-2xl lg:rounded-2xl bg-white overflow-y-auto"
        style={{
          maxHeight: "95vh",
          boxShadow: "var(--shadow-modal)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3 border-b sticky top-0 bg-white z-10"
          style={{ borderColor: "#E2E8F0" }}
        >
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full text-lg"
            style={{ color: "var(--color-text-secondary)" }}
            aria-label="Zavřít"
          >
            ✕
          </button>
          <h2 className="font-semibold text-base" style={{ color: "var(--color-text-primary)" }}>
            {activity ? "Upravit aktivitu" : "Nová aktivita"}
          </h2>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg text-sm font-semibold"
            style={{
              backgroundColor: "var(--color-primary)",
              color: "var(--color-text-inverse)",
            }}
          >
            Uložit
          </button>
        </div>

        {/* Form */}
        <div className="px-4 py-4 flex flex-col gap-4">
          {/* Time */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-text-primary)" }}>
              Čas <span style={{ color: "#EF4444" }}>*</span>
            </label>
            <input
              ref={firstFieldRef}
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border text-base font-mono"
              style={{
                borderColor: errors.time ? "#EF4444" : "#E2E8F0",
                color: "var(--color-text-primary)",
              }}
            />
            {errors.time && (
              <p className="mt-1 text-xs" style={{ color: "#EF4444" }}>
                {errors.time}
              </p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-text-primary)" }}>
              Název <span style={{ color: "#EF4444" }}>*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Název aktivity"
              className="w-full px-3 py-2 rounded-lg border text-base"
              style={{
                borderColor: errors.title ? "#EF4444" : "#E2E8F0",
                color: "var(--color-text-primary)",
              }}
            />
            {errors.title && (
              <p className="mt-1 text-xs" style={{ color: "#EF4444" }}>
                {errors.title}
              </p>
            )}
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-text-primary)" }}>
              Typ
            </label>
            <div className="flex flex-wrap gap-2">
              {ACTIVITY_TYPES.map((t) => {
                const isActive = type === t.value;
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setType(t.value)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all"
                    style={{
                      backgroundColor: isActive ? TYPE_COLORS[t.value] : "transparent",
                      color: isActive ? "white" : "var(--color-text-secondary)",
                      borderColor: isActive ? TYPE_COLORS[t.value] : "#E2E8F0",
                    }}
                  >
                    <span>{t.icon}</span>
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-text-primary)" }}>
              Popis
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Volitelný popis..."
              className="w-full px-3 py-2 rounded-lg border text-base resize-none"
              style={{ borderColor: "#E2E8F0", color: "var(--color-text-primary)" }}
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-text-primary)" }}>
              Místo (název)
            </label>
            <input
              type="text"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder="Např. Cruz de Tejeda"
              className="w-full px-3 py-2 rounded-lg border text-base"
              style={{ borderColor: "#E2E8F0", color: "var(--color-text-primary)" }}
            />
          </div>

          {/* Important */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-text-primary)" }}>
              Důležité upozornění
            </label>
            <textarea
              value={important}
              onChange={(e) => setImportant(e.target.value)}
              rows={2}
              placeholder="Povinná rezervace, upozornění, ..."
              className="w-full px-3 py-2 rounded-lg border text-base resize-none"
              style={{ borderColor: "#E2E8F0", color: "var(--color-text-primary)" }}
            />
          </div>

          <div className="h-4" />
        </div>
      </div>
    </div>
  );
}
