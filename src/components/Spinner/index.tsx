import React from "react";

type TSpinnerProps = { className?: string; label?: string };

/** A small spinning ring. Size and colour come from className (defaults to the brand navy, 24px). */
export const Spinner = ({ className = "h-6 w-6 text-[#0B1F4D]", label = "Loading" }: TSpinnerProps) => (
  <span role="status" aria-label={label} className={`inline-block ${className}`}>
    <svg viewBox="0 0 24 24" className="h-full w-full animate-spin" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeOpacity="0.18" strokeWidth="3" />
      <path d="M21.5 12a9.5 9.5 0 0 0-9.5-9.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  </span>
);

/** Centered spinner that fills the screen. Shown while a page is deciding what to render. */
export const PageSpinner = ({ label = "Loading" }: { label?: string }) => (
  <div className="flex min-h-screen w-full items-center justify-center bg-[#fcfcfd]">
    <Spinner className="h-10 w-10 text-[#0B1F4D]" label={label} />
  </div>
);

export default Spinner;
