import { useEffect, type RefObject } from "react";

const FOCUSABLE_SELECTORS = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  isActive: boolean
) {
  useEffect(() => {
    if (!isActive) return;
    const container = containerRef.current;
    if (!container) return;

    function getFocusable(): HTMLElement[] {
      return Array.from(
        container!.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)
      ).filter(
        (el) =>
          el.offsetParent !== null &&
          !el.closest('[aria-hidden="true"]')
      );
    }

    function handleTab(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      const focusable = getFocusable();
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (e.shiftKey) {
        if (active === first || !container!.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (active === last || !container!.contains(active)) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    container.addEventListener("keydown", handleTab);
    return () => container.removeEventListener("keydown", handleTab);
  }, [isActive, containerRef]);
}
