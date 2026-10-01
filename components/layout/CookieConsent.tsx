"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useConsent, type OptionalCategory } from "@/context/ConsentContext";
import { useLocale } from "@/context/LocaleContext";
import { ArrowLeftIcon, CloseIcon } from "@/components/ui/Icons";

const CATEGORIES = ["necessary", "analytics", "marketing"] as const;

/**
 * Floating consent card (bottom sheet on phones). Non-modal: the page stays
 * usable, but nothing optional loads until the visitor decides.
 */
export function CookieConsent() {
  const { t } = useLocale();
  const { consent, hydrated, settingsOpen, save, acceptAll, rejectAll, closeSettings } = useConsent();
  const id = useId();
  const card = useRef<HTMLDivElement>(null);

  const visible = hydrated && (consent === null || settingsOpen);
  const [view, setView] = useState<"intro" | "details">("intro");
  const [choice, setChoice] = useState<Record<OptionalCategory, boolean>>({ analytics: false, marketing: false });

  // Reopening from the footer: jump straight to the details with the saved choice.
  const [lastOpen, setLastOpen] = useState(settingsOpen);
  if (lastOpen !== settingsOpen) {
    setLastOpen(settingsOpen);
    if (settingsOpen) {
      setView("details");
      setChoice({ analytics: consent?.analytics ?? false, marketing: consent?.marketing ?? false });
    }
  }

  useEffect(() => {
    if (settingsOpen) card.current?.focus({ preventScroll: true });
  }, [settingsOpen]);

  useEffect(() => {
    if (!settingsOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeSettings();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [settingsOpen, closeSettings]);

  if (!visible) return null;

  const firstVisit = consent === null;

  return (
    <div
      ref={card}
      role="dialog"
      aria-modal="false"
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-text`}
      tabIndex={-1}
      className="fixed inset-x-3 bottom-3 z-[45] max-h-[85svh] overflow-y-auto overscroll-contain border border-sand bg-ivory/95 shadow-2xl shadow-charcoal/15 outline-none backdrop-blur-xl sm:inset-x-auto sm:bottom-6 sm:left-6 sm:w-[27rem]"
      style={{
        animation: "fade-up-lg 0.9s var(--ease-soft) both",
        animationDelay: firstVisit ? "calc(var(--intro-delay) + 900ms)" : "0ms",
      }}
    >
      {/* Thin clay rule that draws in — a small editorial touch */}
      <span aria-hidden="true" className="intro-line block h-px w-full bg-clay/70" />

      <div className="p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow flex items-center gap-3 text-taupe">
              <span aria-hidden="true" className="font-serif text-base text-clay italic normal-case tracking-normal">✦</span>
              {t.cookies.eyebrow}
            </p>
            <h2 id={`${id}-title`} className="mt-2 text-3xl leading-tight">
              {view === "intro" ? t.cookies.title : t.cookies.detailsTitle}
            </h2>
          </div>
          {!firstVisit && (
            <button type="button" onClick={closeSettings} aria-label={t.common.close} className="-mt-1 -mr-2 grid h-11 w-11 shrink-0 place-items-center">
              <CloseIcon width={18} height={18} />
            </button>
          )}
        </div>

        {view === "intro" ? (
          <>
            <p id={`${id}-text`} className="mt-3 text-sm leading-relaxed text-taupe">
              {t.cookies.text}
            </p>
            {/* Accept and reject are deliberately equal in size and weight. */}
            <div className="mt-6 grid grid-cols-2 gap-2.5">
              <button type="button" onClick={rejectAll} className="btn btn-outline w-full px-2 text-[11px] tracking-[0.12em]">
                {t.cookies.rejectAll}
              </button>
              <button type="button" onClick={acceptAll} className="btn btn-primary w-full px-2 text-[11px] tracking-[0.12em]">
                {t.cookies.acceptAll}
              </button>
            </div>
            <button
              type="button"
              onClick={() => setView("details")}
              className="link-underline mx-auto mt-4 block text-[13px] text-taupe hover:text-charcoal"
            >
              {t.cookies.customise}
            </button>
          </>
        ) : (
          <>
            <p id={`${id}-text`} className="mt-3 text-sm leading-relaxed text-taupe">
              {t.cookies.detailsText}
            </p>
            <ul className="mt-5 divide-y divide-sand border-y border-sand">
              {CATEGORIES.map((key) => {
                const locked = key === "necessary";
                const checked = locked || choice[key];
                return (
                  <li key={key} className="flex items-start gap-4 py-4">
                    <div className="min-w-0 flex-1">
                      <p id={`${id}-${key}`} className="text-sm font-medium">
                        {t.cookies.categories[key].title}
                        {locked && <span className="ml-2 text-xs font-normal text-taupe">({t.cookies.alwaysOn})</span>}
                      </p>
                      <p id={`${id}-${key}-desc`} className="mt-1 text-[13px] leading-relaxed text-taupe">
                        {t.cookies.categories[key].text}
                      </p>
                    </div>
                    <Switch
                      checked={checked}
                      disabled={locked}
                      labelledBy={`${id}-${key}`}
                      describedBy={`${id}-${key}-desc`}
                      onChange={(value) => !locked && setChoice((c) => ({ ...c, [key]: value }))}
                    />
                  </li>
                );
              })}
            </ul>
            <div className="mt-6 grid grid-cols-2 gap-2.5">
              <button type="button" onClick={() => save(choice)} className="btn btn-outline w-full px-2 text-[11px] tracking-[0.12em]">
                {t.cookies.save}
              </button>
              <button type="button" onClick={acceptAll} className="btn btn-primary w-full px-2 text-[11px] tracking-[0.12em]">
                {t.cookies.acceptAll}
              </button>
            </div>
            {firstVisit && (
              <button
                type="button"
                onClick={() => setView("intro")}
                className="mx-auto mt-4 flex items-center gap-1.5 text-[13px] text-taupe hover:text-charcoal"
              >
                <ArrowLeftIcon width={14} height={14} /> {t.checkout.back}
              </button>
            )}
          </>
        )}

        <p className="mt-5 text-[11px] leading-relaxed text-taupe">{t.cookies.footnote}</p>
      </div>
    </div>
  );
}

function Switch({
  checked,
  disabled,
  labelledBy,
  describedBy,
  onChange,
}: {
  checked: boolean;
  disabled?: boolean;
  labelledBy: string;
  describedBy: string;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      aria-disabled={disabled || undefined}
      onClick={() => !disabled && onChange(!checked)}
      className={`relative mt-0.5 h-7 w-12 shrink-0 rounded-full transition-colors duration-300 ${checked ? "bg-charcoal" : "bg-stone"} ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
    >
      <span
        aria-hidden="true"
        className={`absolute top-1 left-1 h-5 w-5 rounded-full bg-ivory shadow transition-transform duration-300 ease-soft ${checked ? "translate-x-5" : "translate-x-0"}`}
      />
    </button>
  );
}
