interface AddActivityFABProps {
  onAdd: () => void;
}

export function AddActivityFAB({ onAdd }: AddActivityFABProps) {
  return (
    <>
      {/* Mobile FAB */}
      <button
        onClick={onAdd}
        className="lg:hidden fixed z-40 flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-transform active:scale-90"
        style={{
          bottom: "76px",
          right: "16px",
          backgroundColor: "var(--color-secondary)",
          color: "var(--color-text-inverse)",
          boxShadow: "var(--shadow-elevated)",
        }}
        aria-label="Přidat aktivitu"
      >
        <span className="text-2xl font-bold leading-none">+</span>
      </button>

      {/* Desktop inline button */}
      <div className="hidden lg:flex px-4 pb-4 max-w-2xl mx-auto">
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors"
          style={{
            color: "var(--color-primary)",
            borderColor: "var(--color-primary)",
            backgroundColor: "transparent",
          }}
        >
          <span>＋</span>
          <span>Přidat aktivitu</span>
        </button>
      </div>
    </>
  );
}
