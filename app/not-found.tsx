"use client";

import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";

export default function NotFound() {
  const { t } = useLocale();
  return (
    <div className="mx-auto max-w-xl px-4 py-32 text-center">
      <p className="eyebrow text-taupe">404</p>
      <h1 className="mt-4 text-5xl sm:text-6xl">{t.notFound.title}</h1>
      <p className="mt-5 text-taupe">{t.notFound.text}</p>
      <Link href="/shop" className="btn btn-primary mt-10">
        {t.notFound.cta}
      </Link>
    </div>
  );
}
