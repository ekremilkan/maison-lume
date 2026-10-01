"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

export function BrandStory({ image, detail }: { image: string; detail: string }) {
  const { t } = useLocale();

  return (
    <section aria-labelledby="story-title" className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
      <div className="grid items-center gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="relative lg:col-span-5">
          <div className="relative aspect-[4/5] overflow-hidden bg-linen" data-reveal="clip">
            <div data-parallax="0.08" className="absolute inset-x-0 -inset-y-[10%]">
              <Image src={image} alt="" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            </div>
          </div>
          <div
            className="absolute -right-2 -bottom-10 w-[40%] border-[6px] border-ivory shadow-xl shadow-charcoal/10 sm:-right-8 lg:-right-16"
            data-parallax="-0.1"
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-linen" data-reveal="clip" style={d(250)}>
              <Image src={detail} alt="" fill sizes="20vw" className="object-cover" />
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <p className="eyebrow flex items-center gap-3 text-taupe" data-reveal="up">
            <span className="h-px w-8 bg-taupe" aria-hidden="true" />
            {t.home.storyEyebrow}
          </p>
          <h2 id="story-title" className="mt-5 text-5xl leading-[1.02] sm:text-7xl" data-reveal="up" style={d(80)}>
            {t.home.storyTitle}
          </h2>
          <p className="mt-8 max-w-xl leading-relaxed text-taupe" data-reveal="up" style={d(160)}>
            {t.home.storyText}
          </p>
          <blockquote className="mt-8 border-l border-clay pl-6 font-serif text-2xl leading-snug italic sm:text-3xl" data-reveal="up" style={d(240)}>
            {t.home.storyText2}
          </blockquote>
          <div data-reveal="up" style={d(300)}>
            <Link href="/about" className="btn btn-outline mt-10">
              {t.home.storyCta}
            </Link>
          </div>

          <ul className="mt-16 grid gap-8 border-t border-sand pt-8 sm:grid-cols-3 sm:gap-6">
            {t.home.values.map((v, i) => (
              <li key={v.title} data-reveal="up" style={d(i * 100)}>
                <span className="font-serif text-3xl text-clay italic">0{i + 1}</span>
                <h3 className="mt-2 font-sans text-sm font-medium">{v.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-taupe">{v.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
