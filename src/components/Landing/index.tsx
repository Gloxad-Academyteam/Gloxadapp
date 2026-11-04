import Link from "next/link";
import { useState } from "react";
import type { ReactNode } from "react";
import { FiAlertCircle, FiInbox, FiRefreshCw } from "react-icons/fi";

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

export const ErrorState = ({
  onRetry,
  title = "We couldn't load the latest information",
  description = "There was a problem reaching this page. Check your connection, then try again.",
}: {
  onRetry: () => void | Promise<unknown>;
  title?: string;
  description?: string;
}) => {
  const [isRetrying, setIsRetrying] = useState(false);

  const retry = async () => {
    if (isRetrying) return;
    setIsRetrying(true);
    try {
      await onRetry();
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <section role="alert" aria-live="assertive" className="overflow-hidden rounded-[24px] border border-[#e5e7ef] bg-gradient-to-br from-white via-white to-[#f2f5ff] px-6 py-10 text-center shadow-sm sm:px-10 sm:py-12">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eef2ff] text-[#25348b]">
        <FiAlertCircle className="text-[28px]" aria-hidden />
      </div>
      <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#5b66a8]">Temporary loading issue</p>
      <h2 className="mt-2 text-[20px] font-bold text-[#201633] sm:text-[22px]">{title}</h2>
      <p className="mx-auto mt-2 max-w-[460px] text-[14px] leading-[1.7] text-[#5b5e6b]">{description}</p>
      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={retry}
          disabled={isRetrying}
          className="inline-flex h-[46px] min-w-[150px] items-center justify-center gap-2 rounded-full bg-[#07004d] px-7 text-[14px] font-semibold text-white transition hover:bg-[#111456] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#cbd5ff] disabled:cursor-wait disabled:opacity-70"
        >
          <FiRefreshCw className={isRetrying ? "animate-spin" : ""} aria-hidden />
          {isRetrying ? "Trying again..." : "Try again"}
        </button>
        <Link href="/free" className="inline-flex h-[46px] items-center justify-center rounded-full border border-[#d9dced] bg-white px-7 text-[14px] font-semibold text-[#293274] transition hover:border-[#aeb8ec] hover:bg-[#f8f9ff] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#cbd5ff]">
          Explore free courses
        </Link>
      </div>
      <p className="mt-5 text-[12px] text-[#777c8e]">If the problem continues, please try again in a little while.</p>
    </section>
  );
};

export const PrimaryLink = ({ href, children }: { href: string; children: ReactNode }) => (
  <Link href={href} className="mt-6 inline-flex h-[46px] items-center rounded-full bg-[#07004d] px-7 text-[14px] font-semibold text-white transition hover:bg-[#111456]">
    {children}
  </Link>
);

// Admin dates are calendar days stored at midnight UTC, so show them in UTC or they slip a day in some timezones
export const formatDay = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }) : "";
