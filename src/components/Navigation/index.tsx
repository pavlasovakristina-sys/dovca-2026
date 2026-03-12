import type { ActiveView } from "../../types";

interface NavigationProps {
  activeView: ActiveView;
  onViewChange: (view: ActiveView) => void;
}

const TABS: { id: ActiveView; label: string; icon: string }[] = [
  { id: "program", label: "Program", icon: "📋" },
  { id: "map", label: "Mapa", icon: "🗺️" },
  { id: "itinerary", label: "Itinerář", icon: "✈️" },
  { id: "checklist", label: "Checklist", icon: "☑️" },
];

export function Navigation({ activeView, onViewChange }: NavigationProps) {
  function handleKeyDown(e: React.KeyboardEvent, currentIndex: number) {
    if (e.key === "ArrowRight") {
      const next = TABS[(currentIndex + 1) % TABS.length];
      onViewChange(next.id);
    } else if (e.key === "ArrowLeft") {
      const prev = TABS[(currentIndex - 1 + TABS.length) % TABS.length];
      onViewChange(prev.id);
    }
  }

  return (
    <>
      {/* Mobile: fixed bottom bar */}
      <nav
        role="tablist"
        aria-label="Hlavní navigace"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex border-t bg-white"
        style={{
          boxShadow: "var(--shadow-card)",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
          height: "56px",
        }}
      >
        {TABS.map((tab, i) => {
          const isActive = activeView === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onViewChange(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 text-xs font-medium transition-colors min-h-[44px]"
              style={{
                color: isActive ? "var(--color-primary)" : "var(--color-text-secondary)",
              }}
            >
              <span className="text-xl leading-none">{tab.icon}</span>
              <span className="text-[10px]">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Desktop: horizontal top tabs */}
      <nav
        role="tablist"
        aria-label="Hlavní navigace"
        className="hidden lg:flex border-b bg-white px-8"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        {TABS.map((tab, i) => {
          const isActive = activeView === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onViewChange(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              className="flex items-center gap-2 px-4 h-12 text-sm font-medium border-b-2 transition-colors"
              style={{
                color: isActive ? "var(--color-primary)" : "var(--color-text-secondary)",
                borderBottomColor: isActive ? "var(--color-primary)" : "transparent",
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
