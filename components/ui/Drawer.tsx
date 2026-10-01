"use client";

import { useEffect, useRef } from "react";

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

const PANEL_POSITION = {
  right: "inset-y-0 right-0 h-full w-full max-w-md",
  left: "inset-y-0 left-0 h-full w-full max-w-sm",
  bottom: "inset-x-0 bottom-0 max-h-[88dvh] w-full",
};

const PANEL_HIDDEN = {
  right: "translate-x-full",
  left: "-translate-x-full",
  bottom: "translate-y-full",
};

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  label: string;
  side?: keyof typeof PANEL_POSITION;
  className?: string;
  children: React.ReactNode;
}

/**
 * Accessible slide-in panel: modal dialog semantics, focus trap,
 * Escape to close, background scroll lock and focus restoration.
 * Stays mounted while closed (inert) so it can animate both ways.
 */
export function Drawer({ open, onClose, label, side = "right", className = "", children }: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const root = document.documentElement;
    root.style.overflow = "hidden";

    // Focus the dialog itself: screen readers announce its label, and the
    // next Tab lands on the first control without a ring flashing on open.
    const frame = requestAnimationFrame(() => panel?.focus({ preventScroll: true }));

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panel) return;
      const focusable = [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.offsetParent !== null);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === panel)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKeyDown);
      root.style.overflow = "";
      previouslyFocused?.focus({ preventScroll: true });
    };
  }, [open, onClose]);

  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`} inert={!open}>
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`absolute inset-0 bg-charcoal/35 transition-opacity duration-500 ease-soft ${open ? "opacity-100" : "opacity-0"}`}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        className={`absolute flex flex-col bg-ivory shadow-2xl shadow-charcoal/10 outline-none transition-transform duration-500 ease-soft ${PANEL_POSITION[side]} ${open ? "translate-x-0 translate-y-0" : PANEL_HIDDEN[side]} ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
