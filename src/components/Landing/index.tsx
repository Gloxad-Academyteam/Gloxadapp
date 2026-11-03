import Link from "next/link";
import type { ReactNode } from "react";
import { FiAlertCircle, FiInbox } from "react-icons/fi";

// The shared framework for the LMS landing pages: a header, a content area, and the loading, empty and error states

export const LandingPage = ({ title, intro, children }: { title: string; intro: string; children: ReactNode }) => (
  <div className="w-full bg-white">
    <main className="mx-auto min-h-[60vh] w-full max-w-[1100px] px-5 pb-20 pt-10 md:px-10 md:pt-14">
      <header className="mb-10 max-w-[720px]">
        <h1 className="text-[28px] font-bold leading-[1.2] text-[#201633] md:text-[38px]">{title}</h1>
        <p className="mt-3 text-[15px] leading-[1.7] text-[#5b5e6b]">{intro}</p>
      </header>
      {children}
    </main>
  </div>
);

export const LoadingState = ({ rows = 2 }: { rows?: number }) => (
  <div className="flex flex-col gap-5" role="status" aria-label="Loading">
    {Array.from({ length: rows }).map((_, index) => (
      <div key={index} className="h-[200px] animate-pulse rounded-2xl border border-[#e5e7ef] bg-[#f4f5fa]" />
    ))}
  </div>
);

export const EmptyState = ({ title, text, href, action }: { title: string; text: string; href?: string; action?: string }) => (
  <div className="flex flex-col items-center rounded-2xl border border-dashed border-[#d7d9e4] bg-white px-6 py-14 text-center">
    <FiInbox className="text-[30px] text-[#9aa0b4]" aria-hidden />
    <h2 className="mt-4 text-[20px] font-semibold text-[#201633]">{title}</h2>
    <p className="mt-2 max-w-[460px] text-[14px] leading-[1.7] text-[#5b5e6b]">{text}</p>
    {href && action && <PrimaryLink href={href}>{action}</PrimaryLink>}
  </div>
);

export const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <div role="alert" className="flex flex-col items-center rounded-2xl border border-[#f3c9c9] bg-[#fff6f6] px-6 py-12 text-center">
    <FiAlertCircle className="text-[28px] text-[#c0392b]" aria-hidden />
    <h2 className="mt-3 text-[18px] font-semibold text-[#201633]">We could not load this page</h2>
    <p className="mt-1 text-[14px] text-[#5b5e6b]">Check your connection and try again.</p>
    <button type="button" onClick={onRetry} className="mt-5 h-[44px] rounded-full bg-[#07004d] px-7 text-[14px] font-semibold text-white transition hover:bg-[#111456]">
      Try again
    </button>
  </div>
);

export const PrimaryLink = ({ href, children }: { href: string; children: ReactNode }) => (
  <Link href={href} className="mt-6 inline-flex h-[46px] items-center rounded-full bg-[#07004d] px-7 text-[14px] font-semibold text-white transition hover:bg-[#111456]">
    {children}
  </Link>
);

// Admin dates are calendar days stored at midnight UTC, so show them in UTC or they slip a day in some timezones
export const formatDay = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }) : "";
