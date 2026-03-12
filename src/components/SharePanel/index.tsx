import { useRef, useEffect } from "react";
import { useItinerary } from "../../hooks/useItinerary";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import type { ItineraryData } from "../../types";

interface SharePanelProps {
  isOpen: boolean;
  onClose: () => void;
  onToast: (msg: string, type: "success" | "error") => void;
}

export function SharePanel({ isOpen, onClose, onToast }: SharePanelProps) {
  const { state, dispatch } = useItinerary();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useFocusTrap(panelRef, isOpen);

  useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  function handleExport() {
    const blob = new Blob([JSON.stringify(state, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dovca-2026-export.json";
    a.click();
    URL.revokeObjectURL(url);
    onToast("Program exportován.", "success");
  }

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed: unknown = JSON.parse(evt.target?.result as string);
        if (
          !parsed ||
          typeof parsed !== "object" ||
          !("days" in parsed) ||
          !Array.isArray((parsed as Record<string, unknown>).days)
        ) {
          onToast("Soubor nemá správný formát (chybí pole 'days').", "error");
          return;
        }
        const confirmed = window.confirm(
          "Import přepíše aktuální program. Pokračovat?"
        );
        if (!confirmed) return;
        dispatch({ type: "IMPORT", payload: { data: parsed as ItineraryData } });
        onToast("Program importován.", "success");
        onClose();
      } catch {
        onToast("Soubor není platný JSON. Zkus jiný soubor.", "error");
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsText(file);
  }

  function handleReset() {
    const confirmed = window.confirm(
      "Všechny změny budou ztraceny. Pokračovat?"
    );
    if (!confirmed) return;
    dispatch({ type: "RESET" });
    onToast("Program obnoven na původní verzi.", "success");
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center"
      aria-modal="true"
      role="dialog"
      aria-label="Sdílet program"
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        className="relative z-10 w-full max-w-lg rounded-t-2xl bg-white"
        style={{
          boxShadow: "var(--shadow-modal)",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "#E2E8F0" }}>
          <h2 className="font-semibold text-base" style={{ color: "var(--color-text-primary)" }}>
            Sdílet program
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full"
            style={{ color: "var(--color-text-secondary)" }}
            aria-label="Zavřít"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-3 px-5 py-4">
          <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
            Exportuj nebo importuj program jako JSON soubor.
          </p>

          <button
            onClick={handleExport}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border text-sm font-medium min-h-[48px]"
            style={{
              borderColor: "var(--color-primary)",
              color: "var(--color-primary)",
            }}
          >
            📤 Exportovat program
          </button>

          <button
            onClick={handleImportClick}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border text-sm font-medium min-h-[48px]"
            style={{
              borderColor: "var(--color-primary)",
              color: "var(--color-primary)",
            }}
          >
            📥 Importovat program
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
            aria-hidden="true"
          />

          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border text-sm font-medium min-h-[48px]"
            style={{ borderColor: "#EF4444", color: "#EF4444" }}
          >
            ♻️ Obnovit původní
          </button>
        </div>
      </div>
    </div>
  );
}
