/** Circular text that slowly rotates — an editorial "stamp". */
export function RotatingBadge({ text, size = 132 }: { text: string; size?: number }) {
  return (
    <div className="relative grid place-items-center rounded-full bg-ivory/85 backdrop-blur-sm" style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 100 100" className="absolute inset-0 animate-spin-slow">
        <defs>
          <path id="badge-circle" d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
        </defs>
        <text className="fill-charcoal font-sans text-[8.4px] tracking-[0.2em] uppercase">
          <textPath href="#badge-circle" textLength="236">
            {text}
          </textPath>
        </text>
      </svg>
      <span className="font-serif text-2xl text-clay italic">ML</span>
    </div>
  );
}
