"use client";

import { useLocale } from "@/context/LocaleContext";
import { CheckIcon } from "@/components/ui/Icons";

const STEPS = ["contact", "shipping", "payment", "confirmation"] as const;

interface StepperProps {
  current: number;
  /** Called when the user jumps back to a completed step. Omit to lock the steps. */
  onSelect?: (step: number) => void;
}

export function Stepper({ current, onSelect }: StepperProps) {
  const { t } = useLocale();

  return (
    <nav aria-label={t.checkout.title} className="mt-8">
      <ol className="flex items-center gap-2 sm:gap-3">
        {STEPS.map((key, i) => {
          const done = i < current;
          const active = i === current;
          const content = (
            <>
              <span
                className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border text-[11px] transition-colors ${done ? "border-charcoal bg-charcoal text-ivory" : active ? "border-charcoal" : "border-stone text-taupe"}`}
                aria-hidden="true"
              >
                {done ? <CheckIcon width={12} height={12} strokeWidth={2} /> : i + 1}
              </span>
              <span className={`text-[12px] sm:text-sm ${active ? "" : "text-taupe"} ${active ? "" : "max-sm:sr-only"}`}>
                {t.checkout.steps[key]}
              </span>
            </>
          );
          return (
            <li key={key} className="flex items-center gap-2 sm:gap-3" aria-current={active ? "step" : undefined}>
              {done && onSelect ? (
                <button type="button" onClick={() => onSelect(i)} className="flex items-center gap-2 hover:[&>span:last-child]:text-charcoal">
                  {content}
                </button>
              ) : (
                <span className="flex items-center gap-2">{content}</span>
              )}
              {i < STEPS.length - 1 && <span className="h-px w-4 bg-stone sm:w-10" aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
