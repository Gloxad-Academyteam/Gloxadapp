"use client";

import Link from "next/link";
import { FiClock } from "react-icons/fi";

// Trimester courses are cohort programmes; none is on offer while every course is free and self-paced
const TrimesterBanner = () => (
  <div className="relative flex w-full flex-col items-start gap-6 overflow-hidden rounded-[24px] bg-gradient-to-r from-[#0a1b56] to-[#4f76c4] px-6 py-10 shadow-sm md:rounded-[36px] md:px-12 md:py-14 lg:flex-row lg:items-center lg:justify-between">
    <div className="max-w-[620px]">
      <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-[12px] font-semibold text-white">
        <FiClock className="text-[13px]" /> Not available
      </span>
      <h2 className="mt-4 text-[26px] font-semibold leading-[1.2] text-white md:text-[34px] lg:text-[38px]">Trimester Courses</h2>
      <p className="mt-3 text-[14px] leading-[1.6] text-white/90 lg:text-[15px]">
        Trimester courses are not available right now. Every Gloxad Academy course is free and self-paced, so you can start learning today.
      </p>
    </div>
    <Link
      href="/free"
      className="inline-flex h-[46px] shrink-0 items-center rounded-full bg-white px-8 text-[14px] font-semibold text-[#0a1b56] transition hover:bg-[#eef2ff]"
    >
      Browse free courses
    </Link>
  </div>
);

export default TrimesterBanner;
