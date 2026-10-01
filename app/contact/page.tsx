import type { Metadata } from "next";
import { editorialImages } from "@/data/products";
import { ContactView } from "@/components/pages/ContactView";
import { PageTransition } from "@/components/motion/PageTransition";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Maison Lume or visit our boutique and studio in Leipzig.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <PageTransition>
      <ContactView image={editorialImages.contact} />
    </PageTransition>
  );
}
