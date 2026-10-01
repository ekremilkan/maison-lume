import type { Metadata } from "next";
import { editorialImages } from "@/data/products";
import { AboutView } from "@/components/pages/AboutView";
import { PageTransition } from "@/components/motion/PageTransition";

export const metadata: Metadata = {
  title: "About",
  description: "Maison Lume is a small women's fashion boutique founded in Leipzig in 2019, working with fewer than twenty makers across Europe.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <PageTransition>
      <AboutView heroImage={editorialImages.aboutHero} studioImage={editorialImages.aboutStudio} />
    </PageTransition>
  );
}
