"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { HiArrowLongLeft } from "react-icons/hi2";
import TypewriterText from "./TypewriterText";

type AuthCardProps = {
  /** Headline lines typed out once over the image (desktop only). */
  headline: string[];
  /** Simple single-image panel. Ignored when `panel` is provided. */
  image?: { src: string };
  imageAlt?: string;
  /** Fully custom image layers (e.g. the sign-up slideshow). Must fill its parent (`absolute inset-0`). */
  panel?: ReactNode;
  /** Fades the headline + gradient out (used by image slides that already contain text). */
  headlineHidden?: boolean;
  /** The form / status content. */
  children: ReactNode;
};

/**
 * Shared shell for every auth screen.
 *
 * MOBILE  (below lg): only the form is shown, edge to edge, no card chrome until `sm`.
 * No top navigation on auth pages; the card grows with its content (so the social buttons are never clipped) and has a minimum height so short screens keep the same frame.
 * DESKTOP (lg and up): image panel + form sit together inside ONE rounded card (no shadow).
 */
const AuthCard = ({ headline, image, imageAlt = "", panel, headlineHidden = false, children }: AuthCardProps) => {
  return (
    <main className="flex min-h-[calc(100dvh-140px)] w-full flex-col items-center justify-center bg-white px-0 sm:bg-[#f5f7fb] sm:px-6 sm:py-8">
      {/* Top row (mobile + desktop), OUTSIDE the card: logo on the left, animated "Back to home" pill on the right */}
      <div className="flex w-full max-w-[1080px] items-center justify-between gap-3 px-5 pb-4 pt-5 sm:px-0 sm:pt-0">
        <Link href="/" aria-label="Gloxad Academy home" className="shrink-0">
          <img src="/gloxadlogo.png" alt="Gloxad Academy" className="h-10 w-[124px] object-contain object-left sm:h-12 sm:w-[150px]" />
        </Link>
        <Link
          href="/"
          className="group inline-flex items-center gap-2 rounded-full border border-[#e6e8ee] bg-white py-1 pl-1 pr-3.5 text-[13px] font-medium text-[#202127] transition hover:border-[#07004d]/30 hover:bg-[#f5f7fb]"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#07004d] text-[16px] text-white transition-transform duration-300 group-hover:-translate-x-0.5">
            <HiArrowLongLeft className="transition-transform duration-300 group-hover:-translate-x-0.5" />
          </span>
          Back to home
        </Link>
      </div>

      <div className="w-full max-w-[1080px] overflow-hidden bg-white sm:rounded-[24px] sm:border sm:border-[#eceef3] lg:grid lg:min-h-[600px] lg:grid-cols-2">
        {/* ===================== DESKTOP (lg and up) — image panel inside the card ===================== */}
        <div className="relative m-3 hidden overflow-hidden rounded-[18px] bg-gradient-to-br from-[#126888] to-[#1a90bc] lg:block">
          {panel ??
            (image && <img src={image.src} alt={imageAlt} className="absolute inset-0 h-full w-full object-cover" />)}

          <div
            className={`pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-[#020d14]/85 via-[#020d14]/15 to-transparent transition-opacity duration-500 ${
              headlineHidden ? "opacity-0" : "opacity-100"
            }`}
          />
          <div
            className={`pointer-events-none absolute inset-x-0 bottom-10 z-20 flex justify-center px-8 transition-opacity duration-500 ${
              headlineHidden ? "opacity-0" : "opacity-100"
            }`}
          >
            <TypewriterText
              lines={headline}
              className="text-center text-[30px] font-bold leading-[1.25] text-white xl:text-[34px]"
            />
          </div>
        </div>

        {/* ===================== MOBILE (below lg) — form only; DESKTOP — right half of the card ===================== */}
        <section className="flex w-full flex-col px-5 py-8 sm:px-12 sm:py-12 lg:px-10 lg:py-8 xl:px-14">
          <div className="mx-auto my-auto flex w-full max-w-[420px] flex-col">{children}</div>
        </section>
      </div>
    </main>
  );
};

export default AuthCard;
