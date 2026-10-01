"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";
import { SITE } from "@/lib/site";

export function AboutView({ heroImage, studioImage }: { heroImage: string; studioImage: string }) {
  const { t } = useLocale();
  const sections = [
    { title: t.about.section1Title, text: t.about.section1Text },
    { title: t.about.section2Title, text: t.about.section2Text },
    { title: t.about.section3Title, text: t.about.section3Text },
  ];

  return (
    <article>
      <header className="stagger mx-auto max-w-[1440px] px-4 pt-10 sm:px-6 sm:pt-16 lg:px-10">
        <p className="eyebrow text-taupe">{t.about.eyebrow}</p>
        <h1 className="mt-4 max-w-5xl text-6xl leading-[0.98] tracking-[-0.02em] sm:text-8xl lg:text-[8.5rem]">{t.about.title}</h1>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-taupe">{t.about.intro}</p>
      </header>

      <div className="curtain relative mt-12 aspect-[4/3] w-full overflow-hidden sm:mt-20 sm:aspect-[21/9]" style={{ "--d": "300ms" } as React.CSSProperties}>
        <div data-parallax="0.1" className="absolute inset-x-0 -inset-y-[12%]">
          <Image src={heroImage} alt="" fill priority sizes="100vw" className="ken-burns object-cover" style={{ "--d": "300ms" } as React.CSSProperties} />
        </div>
      </div>

      <dl className="mx-auto grid max-w-[1440px] grid-cols-3 gap-4 px-4 py-14 sm:px-6 sm:py-20 lg:px-10">
        {t.about.numbers.map((n, i) => (
          <div key={n.label} className="flex flex-col border-t border-stone pt-4" data-reveal="up" style={{ "--d": `${i * 100}ms` } as React.CSSProperties}>
            <dt className="order-2 mt-1 text-[13px] text-taupe sm:text-sm">{n.label}</dt>
            <dd className="order-1 font-serif text-3xl sm:text-6xl">{n.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mx-auto grid max-w-[1440px] gap-12 px-4 sm:px-6 lg:grid-cols-[5fr_6fr] lg:gap-24 lg:px-10">
        <div className="relative aspect-[4/5] overflow-hidden lg:sticky lg:top-28 lg:self-start" data-reveal="clip">
          <Image src={studioImage} alt="" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
        </div>
        <div className="space-y-14 lg:py-10">
          {sections.map((s, i) => (
            <section key={s.title} data-reveal="up">
              <span className="font-serif text-clay italic">0{i + 1}</span>
              <h2 className="mt-2 text-3xl sm:text-4xl">{s.title}</h2>
              <p className="mt-4 max-w-xl leading-relaxed text-taupe">{s.text}</p>
            </section>
          ))}

          <section className="bg-linen p-8" data-reveal="up">
            <h2 className="text-3xl">{t.about.visitTitle}</h2>
            <p className="mt-3 leading-relaxed text-taupe">{t.about.visitText}</p>
            <p className="mt-4 text-sm">
              {SITE.address.street}, {SITE.address.city}
            </p>
            <Link href="/contact" className="btn btn-outline mt-6">
              {t.nav.contact}
            </Link>
          </section>
        </div>
      </div>
    </article>
  );
}
