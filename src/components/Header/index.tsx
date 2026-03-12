interface HeaderProps {
  title: string;
  dateRange: { start: string; end: string };
  onShareOpen: () => void;
}

function formatDateRange(start: string, end: string): string {
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString("cs-CZ", { day: "numeric", month: "numeric" });
  return `${fmt(start)} – ${fmt(end)}`;
}

export function Header({ title, dateRange, onShareOpen }: HeaderProps) {
  return (
    <header
      className="sticky top-0 z-50 flex items-center justify-between px-4 h-14 lg:h-16 lg:px-8"
      style={{ backgroundColor: "var(--color-primary)" }}
    >
      <div className="flex flex-col">
        <span
          className="font-bold leading-tight text-lg"
          style={{ color: "var(--color-text-inverse)" }}
        >
          {title}
        </span>
        <span
          className="text-xs font-mono leading-tight"
          style={{ color: "rgba(255,255,255,0.8)" }}
        >
          {formatDateRange(dateRange.start, dateRange.end)}
        </span>
      </div>
      <button
        onClick={onShareOpen}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
        style={{
          backgroundColor: "rgba(255,255,255,0.15)",
          color: "var(--color-text-inverse)",
        }}
        aria-label="Exportovat / importovat program"
      >
        ⚙️ <span className="hidden lg:inline">Sdílet</span>
      </button>
    </header>
  );
}
