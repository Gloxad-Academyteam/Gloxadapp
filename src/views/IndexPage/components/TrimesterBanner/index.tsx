"use client";

import Link from "next/link";

// Points at the trimester page, which shows whatever programmes the admin has published
const TrimesterBanner = () => (
  <div className="relative flex w-full flex-col items-start gap-6 overflow-hidden rounded-[24px] bg-gradient-to-r from-[#0a1b56] to-[#4f76c4] px-6 py-10 shadow-sm md:rounded-[36px] md:px-12 md:py-14 lg:flex-row lg:items-center lg:justify-between">
    <div className="max-w-[620px]">
      <h2 className="text-[26px] font-semibold leading-[1.2] text-white md:text-[34px] lg:text-[38px]">Trimester Program</h2>
      <p className="mt-3 text-[14px] leading-[1.6] text-white/90 lg:text-[15px]">
        Four weeks of guided learning with live classes, assignments and a final project, finishing with a certificate.
      </p>
    </div>
    <Link
      href="/trimester"
      className="inline-flex h-[46px] shrink-0 items-center rounded-full bg-white px-8 text-[14px] font-semibold text-[#0a1b56] transition hover:bg-[#eef2ff]"
    >
      View the program
    </Link>
  </div>
);

export default TrimesterBanner;
