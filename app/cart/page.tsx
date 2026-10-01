import type { Metadata } from "next";
import { CartView } from "@/components/cart/CartView";
import { PageTransition } from "@/components/motion/PageTransition";

export const metadata: Metadata = {
  title: "Your bag",
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return (
    <PageTransition>
      <CartView />
    </PageTransition>
  );
}
