"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";
import { Emphasis } from "./Emphasis";
import { RotatingBadge } from "./RotatingBadge";

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

export function Hero({ image, detail }: { image: string; detail: string }) {
  const { t } = useLocale();

  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <div className="mx-auto grid max-w-[1440px] items-center gap-14 px-4 pt-8 pb-24 sm:px-6 lg:min-h-[calc(100svh-6.5rem)] lg:grid-cols-12 lg:gap-8 lg:px-10 lg:pt-4 lg:pb-16">
        {/* Copy */}
        <div className="relative z-10 lg:col-span-6 lg:-mr-28 xl:-mr-36">
          <p className="enter eyebrow flex items-center gap-3 text-taupe" style={delay(0)}>
            <span className="h-px w-8 bg-taupe" aria-hidden="true" />
            {t.home.heroEyebrow}
          </p>
          <h1 id="hero-title" className="mt-6 text-[clamp(3.1rem,8.6vw,8.75rem)] leading-[0.92] tracking-[-0.025em]">
            <span className="sr-only">{t.home.heroTitle}</span>
            <span aria-hidden="true">
              {t.home.heroLines.map((line, i) => (
                <span key={line} className={`line ${i === 1 ? "lg:pl-[0.9em]" : ""}`}>
                  <span style={delay(150 + i * 120)}>
                    <Emphasis text={line} />
                  </span>
                </span>
              ))}
            </span>
          </h1>
          <p className="enter mt-8 max-w-sm text-[15px] leading-relaxed text-taupe sm:text-base lg:mt-10" style={delay(600)}>
            {t.home.heroText}
          </p>
          {/* Equal-width buttons: stacked full width on phones, two even columns above. */}
          <div className="enter mt-8 grid gap-3 sm:max-w-[34rem] sm:grid-cols-2" style={delay(720)}>
            <Link href="/shop" className="btn btn-primary w-full px-5">
              {t.home.heroCta}
            </Link>
            <Link href="/about" className="btn btn-outline w-full px-5">
              {t.home.heroSecondary}
            </Link>
          </div>
        </div>

        {/* Image collage */}
        <div className="relative lg:col-span-6 lg:col-start-7 lg:h-[min(78svh,840px)]">
          <div className="curtain relative aspect-[4/5] overflow-hidden bg-linen sm:aspect-[16/12] lg:aspect-auto lg:h-full" style={delay(100)}>
            <div data-parallax="0.06" className="absolute inset-x-0 -inset-y-[8%]">
              <Image
                src={image}
                alt=""
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="ken-burns object-cover object-[72%_50%]"
                style={delay(100)}
              />
            </div>
          </div>

          <div data-parallax="-0.09" className="absolute -bottom-12 -left-1 w-[42%] sm:w-[32%] lg:-bottom-10 lg:-left-24 lg:w-[36%]">
            <div className="curtain relative aspect-[3/4] overflow-hidden border-[6px] border-ivory bg-linen shadow-2xl shadow-charcoal/15" style={delay(520)}>
              <Image src={detail} alt="" fill sizes="(min-width: 1024px) 18vw, 40vw" className="ken-burns object-cover" style={delay(520)} />
            </div>
          </div>

          <div className="enter absolute right-3 -bottom-16 sm:right-8 lg:right-10 lg:-bottom-14" style={delay(900)}>
            <RotatingBadge text={t.home.heroBadge} />
          </div>
        </div>
      </div>

      <div className="enter absolute bottom-8 left-10 hidden items-center gap-4 lg:flex" style={delay(1100)} aria-hidden="true">
        <span className="relative h-12 w-px overflow-hidden bg-stone">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scroll-line_1.8s_var(--ease-soft)_infinite] bg-charcoal" />
        </span>
        <span className="eyebrow text-taupe">{t.home.scroll}</span>
      </div>
    </section>
  );
}
