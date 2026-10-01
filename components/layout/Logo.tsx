import Link from "next/link";

export function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link href="/" onClick={onClick} className="font-serif text-[1.15rem] leading-none tracking-[0.22em] whitespace-nowrap uppercase sm:text-2xl sm:tracking-[0.28em]">
      Maison Lume
    </Link>
  );
}
