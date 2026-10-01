import Link from "next/link";
import { ArrowRightIcon } from "./Icons";

interface SectionHeadingProps {
  title: string;
  eyebrow?: string;
  id?: string;
  link?: { href: string; label: string };
}

export function SectionHeading({ title, eyebrow, id, link }: SectionHeadingProps) {
  return (
    <div className="mb-8 flex items-end justify-between gap-6 sm:mb-12" data-reveal="up">
      <div>
        {eyebrow && <p className="eyebrow mb-3 text-taupe">{eyebrow}</p>}
        <h2 id={id} className="text-4xl sm:text-6xl">
          {title}
        </h2>
      </div>
      {link && (
        <Link href={link.href} className="eyebrow group flex shrink-0 items-center gap-2 pb-2">
          <span className="link-underline">{link.label}</span>
          <ArrowRightIcon width={14} height={14} className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}
