import { ViewTransition } from "react";

/** Fades and lifts page content in on navigation (the header stays put). */
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="page" exit="page" default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}
