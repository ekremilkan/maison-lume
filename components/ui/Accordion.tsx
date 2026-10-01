"use client";

import { useId, useState } from "react";
import { PlusIcon } from "./Icons";

interface AccordionItemProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export function AccordionItem({ title, defaultOpen = false, children }: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();

  return (
    <div className="border-b border-sand">
      <h3 className="font-sans">
        <button
          type="button"
          id={`${id}-button`}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center justify-between py-5 text-left"
        >
          <span className="eyebrow">{title}</span>
          <PlusIcon
            width={16}
            height={16}
            className={`transition-transform duration-300 ease-soft ${open ? "rotate-45" : ""}`}
          />
        </button>
      </h3>
      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-button`}
        className={`grid transition-[grid-template-rows] duration-400 ease-soft ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden" inert={!open}>
          <div className="pb-6 text-[15px] leading-relaxed text-taupe">{children}</div>
        </div>
      </div>
    </div>
  );
}
