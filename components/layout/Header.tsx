"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useLocale } from "@/context/LocaleContext";
import { CART_BUTTON_ID, SHOW_HEADER_EVENT } from "@/lib/fly-to-cart";
import { interpolate } from "@/lib/format";
import type { Category, CategorySlug } from "@/lib/types";
import { BagIcon, ChevronDownIcon, MenuIcon } from "@/components/ui/Icons";
import { LanguageToggle } from "./LanguageToggle";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";

interface HeaderProps {
  categories: Category[];
  counts: Record<CategorySlug, number>;
  menuImages: { edit: string; latest: string };
}

export function Header({ categories, counts, menuImages }: HeaderProps) {
  const { t, l, locale, setLocale } = useLocale();
  const { count, openCart } = useCart();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const megaButton = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<number>(undefined);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // Close any open menu when the route changes (e.g. browser back).
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMenuOpen(false);
    setMegaOpen(false);
  }

  // Hide while scrolling down, reveal on scroll up.
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      if (y < 140) setHidden(false);
      else if (y > lastY + 6) setHidden(true);
      else if (y < lastY - 6) setHidden(false);
      lastY = y;
    };
    const show = () => setHidden(false);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener(SHOW_HEADER_EVENT, show);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener(SHOW_HEADER_EVENT, show);
    };
  }, []);

  const isHidden = hidden && !megaOpen && !menuOpen;

  // Let sticky elements elsewhere sit directly under the visible header.
  useEffect(() => {
    const height = headerRef.current?.offsetHeight ?? 64;
    document.documentElement.style.setProperty("--header-offset", isHidden ? "0px" : `${height}px`);
  }, [isHidden]);

  useEffect(() => {
    if (!megaOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMegaOpen(false);
      megaButton.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [megaOpen]);

  const openMega = () => {
    window.clearTimeout(closeTimer.current);
    setMegaOpen(true);
  };
  const scheduleCloseMega = () => {
    closeTimer.current = window.setTimeout(() => setMegaOpen(false), 160);
  };

  const otherLocale = locale === "en" ? "de" : "en";
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <>
      <header
        ref={headerRef}
        style={{ viewTransitionName: "site-header" }}
        onMouseLeave={scheduleCloseMega}
        className={`sticky top-0 z-40 border-b bg-ivory/90 backdrop-blur-md transition-[transform,border-color] duration-500 ease-soft ${scrolled || megaOpen ? "border-sand" : "border-transparent"} ${isHidden ? "-translate-y-full" : "translate-y-0"}`}
      >
        <div className="mx-auto grid h-16 max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6 lg:h-20 lg:px-10">
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="-ml-2 grid h-11 w-11 place-items-center lg:hidden"
              aria-label={t.common.openMenu}
              aria-expanded={menuOpen}
            >
              <MenuIcon />
            </button>
            <nav aria-label={t.nav.mainNav} className="hidden lg:block">
              <ul className="flex items-center gap-9">
                <li className="flex items-center gap-1" onMouseEnter={openMega}>
                  <Link
                    href="/shop"
                    onClick={() => setMegaOpen(false)}
                    aria-current={pathname.startsWith("/shop") ? "page" : undefined}
                    className="link-underline eyebrow py-1"
                  >
                    {t.nav.shop}
                  </Link>
                  <button
                    ref={megaButton}
                    type="button"
                    onClick={() => setMegaOpen((o) => !o)}
                    aria-expanded={megaOpen}
                    aria-controls="mega-menu"
                    aria-label={t.nav.showCategories}
                    className="grid h-8 w-6 place-items-center"
                  >
                    <ChevronDownIcon width={14} height={14} className={`transition-transform duration-300 ${megaOpen ? "rotate-180" : ""}`} />
                  </button>
                </li>
                {[
                  { href: "/about", label: t.nav.about },
                  { href: "/contact", label: t.nav.contact },
                ].map((link) => (
                  <li key={link.href} onMouseEnter={scheduleCloseMega}>
                    <Link href={link.href} aria-current={pathname.startsWith(link.href) ? "page" : undefined} className="link-underline eyebrow py-1">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <Logo />

          <div className="flex items-center justify-end gap-0 sm:gap-4">
            <LanguageToggle className="hidden sm:flex" />
            <button
              type="button"
              lang={otherLocale}
              onClick={() => setLocale(otherLocale)}
              aria-label={t.common.switchLanguageLabel}
              className="eyebrow grid h-11 w-9 place-items-center text-taupe sm:hidden"
            >
              {otherLocale}
            </button>
            <button
              id={CART_BUTTON_ID}
              type="button"
              onClick={openCart}
              className="relative -mr-2 grid h-11 w-11 place-items-center"
              aria-label={interpolate(t.nav.openCart, { count })}
            >
              <BagIcon width={22} height={22} />
              {count > 0 && (
                <span
                  key={count}
                  className="absolute top-1.5 right-1 grid h-[18px] min-w-[18px] animate-fade-up place-items-center rounded-full bg-clay px-1 text-[10px] font-medium text-ivory"
                  aria-hidden="true"
                >
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Desktop mega menu */}
        <div
          id="mega-menu"
          onMouseEnter={openMega}
          inert={!megaOpen}
          className={`absolute inset-x-0 top-full hidden border-b border-sand bg-ivory transition-[opacity,translate] duration-500 ease-soft lg:block ${megaOpen ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"}`}
        >
          <div className="mx-auto grid max-w-[1440px] grid-cols-12 gap-10 px-10 py-12">
            <ul className="col-span-5 space-y-1">
              <li>
                <MegaLink href="/shop" label={t.shop.allPieces} count={total} delay={0} open={megaOpen} onNavigate={() => setMegaOpen(false)} />
              </li>
              {categories.map((c, i) => (
                <li key={c.slug}>
                  <MegaLink
                    href={`/shop?category=${c.slug}`}
                    label={l(c.name)}
                    count={counts[c.slug]}
                    delay={(i + 1) * 50}
                    open={megaOpen}
                    onNavigate={() => setMegaOpen(false)}
                  />
                </li>
              ))}
            </ul>
            {[
              { href: "/shop?collection=autumn-edit", image: menuImages.edit, label: t.home.featuredTitle, eyebrow: t.home.featuredEyebrow },
              { href: "/shop", image: menuImages.latest, label: t.home.newArrivalsTitle, eyebrow: t.home.heroEyebrow },
            ].map((card, i) => (
              <Link
                key={card.href}
                href={card.href}
                onClick={() => setMegaOpen(false)}
                className={`group col-span-3 block ${i === 0 ? "col-start-7" : ""} ${megaOpen ? "animate-fade-up" : ""}`}
                style={{ animationDelay: `${150 + i * 80}ms` }}
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-linen">
                  <Image src={card.image} alt="" fill sizes="25vw" loading="eager" className="object-cover transition-transform duration-[1.4s] ease-soft group-hover:scale-105" />
                </div>
                <p className="eyebrow mt-4 text-taupe">{card.eyebrow}</p>
                <p className="mt-1 font-serif text-2xl">{card.label}</p>
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* Dim the page behind the mega menu */}
      <div
        aria-hidden="true"
        onClick={() => setMegaOpen(false)}
        className={`fixed inset-0 z-30 hidden bg-charcoal/20 transition-opacity duration-500 lg:block ${megaOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />

      <MobileMenu open={menuOpen} onClose={closeMenu} categories={categories} />
    </>
  );
}

function MegaLink({
  href,
  label,
  count,
  delay,
  open,
  onNavigate,
}: {
  href: string;
  label: string;
  count: number;
  delay: number;
  open: boolean;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`group flex items-baseline gap-3 py-1 font-serif text-4xl transition-[translate,color] duration-500 ease-soft hover:translate-x-3 hover:text-clay ${open ? "animate-fade-up" : ""}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {label}
      <sup className="font-sans text-xs text-taupe">{String(count).padStart(2, "0")}</sup>
    </Link>
  );
}
