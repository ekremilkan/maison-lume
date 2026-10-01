"use client";

import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";
import { SITE } from "@/lib/site";
import type { Category } from "@/lib/types";
import { Drawer } from "@/components/ui/Drawer";
import { CloseIcon } from "@/components/ui/Icons";
import { LanguageToggle } from "./LanguageToggle";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  categories: Category[];
}

export function MobileMenu({ open, onClose, categories }: MobileMenuProps) {
  const { t, l } = useLocale();

  return (
    <Drawer open={open} onClose={onClose} label={t.nav.mainNav} side="left">
      <div className="flex items-center justify-between px-5 py-3">
        <LanguageToggle />
        <button type="button" onClick={onClose} className="-mr-2 grid h-11 w-11 place-items-center" aria-label={t.common.closeMenu}>
          <CloseIcon />
        </button>
      </div>

      <nav aria-label={t.nav.mainNav} className="flex-1 overflow-y-auto px-5 pt-4">
        <ul className="space-y-1">
          <li>
            <Link href="/shop" onClick={onClose} className="block py-2 font-serif text-4xl">
              {t.nav.shop}
            </Link>
          </li>
          {categories.map((c, i) => (
            <li key={c.slug} style={{ transitionDelay: open ? `${80 + i * 40}ms` : "0ms" }} className={`transition-all duration-500 ease-soft ${open ? "translate-x-0 opacity-100" : "-translate-x-3 opacity-0"}`}>
              <Link href={`/shop?category=${c.slug}`} onClick={onClose} className="block py-2 pl-4 text-lg text-taupe hover:text-charcoal">
                {l(c.name)}
              </Link>
            </li>
          ))}
          <li className="pt-4">
            <Link href="/about" onClick={onClose} className="block py-2 font-serif text-4xl">
              {t.nav.about}
            </Link>
          </li>
          <li>
            <Link href="/contact" onClick={onClose} className="block py-2 font-serif text-4xl">
              {t.nav.contact}
            </Link>
          </li>
        </ul>
      </nav>

      <div className="border-t border-sand px-5 pt-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-sm text-taupe">
        <p>{SITE.address.street}, {SITE.address.city}</p>
        <a href={`mailto:${SITE.email}`} className="link-underline mt-1 inline-block">
          {SITE.email}
        </a>
      </div>
    </Drawer>
  );
}
