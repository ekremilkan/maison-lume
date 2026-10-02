const WORD = "MAISON LUME";

/** Opening curtain. Server-rendered and CSS-driven; see `.intro` in globals.css. */
export function Intro() {
  return (
    <div className="intro" aria-hidden="true">
      <div className="text-center">
        <p className="font-serif text-4xl tracking-[0.3em] sm:text-6xl">
          {[...WORD].map((ch, i) => (
            <span key={i} className="intro-letter" style={{ "--i": i } as React.CSSProperties}>
              {ch === " " ? " " : ch}
            </span>
          ))}
        </p>
        <div className="intro-line mx-auto mt-6 h-px w-24 bg-stone" />
      </div>
    </div>
  );
}

/**
 * Runs before first paint: marks JS as available (enables scroll reveals) and
 * decides whether to play the intro — only on the home page, once per session.
 */
const HOME = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/`;
export const BOOT_SCRIPT = `(function(){var d=document.documentElement;d.classList.add('js');try{var p=location.pathname;if(p.charAt(p.length-1)!=='/')p+='/';if(p!==${JSON.stringify(HOME)}||sessionStorage.getItem('ml-intro')){d.classList.add('no-intro')}else{sessionStorage.setItem('ml-intro','1')}}catch(e){d.classList.add('no-intro')}})();`;
