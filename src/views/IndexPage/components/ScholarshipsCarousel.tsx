"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { FiCheckCircle } from "react-icons/fi";
import ScholarshipGrant from "@assets/images/scholarship-grant.png";
import ScholarshipTech from "@assets/images/scholarship-tech.png";
import { formatDay } from "@components/Landing";
import { lmsPublicApi, type TPublicScholarship } from "@services/lmsPublic";

const IMAGES = [ScholarshipTech, ScholarshipGrant];

const HOW_IT_WORKS = [
  "Free access to the course or program the scholarship covers",
  "Apply online with a short statement. It takes a few minutes",
  "Follow your application from submitted to approved, with a note from the reviewer",
];

const stateLabel = (item: TPublicScholarship) => (item.state === "open" ? "Open now" : `Opens ${formatDay(item.opensAt)}`);

// One scholarship: the picture, what it is, who can apply, when, and a way in
const ScholarshipCard = ({ item, index }: { item: TPublicScholarship; index: number }) => (
  <article className="flex w-[290px] shrink-0 flex-col overflow-hidden rounded-[18px] bg-white shadow-[0_10px_30px_rgba(11,31,77,0.14)] sm:w-auto">
    <img src={IMAGES[index % IMAGES.length].src} alt="" className="h-[170px] w-full object-cover" />
    <div className="flex flex-1 flex-col p-5">
      <span className={`mb-2 inline-flex w-fit rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${item.state === "open" ? "bg-[#e6f6ec] text-[#15803d]" : "bg-[#fff3e0] text-[#b45309]"}`}>
        {stateLabel(item)}
      </span>
      <h3 className="text-[17px] font-bold leading-snug text-[#202127]">{item.title}</h3>
      {(item.summary || item.description) && <p className="mt-2 line-clamp-3 text-[13px] leading-[1.55] text-[#5b5e6b]">{item.summary || item.description}</p>}
      {item.eligibility.length > 0 && (
        <p className="mt-2 line-clamp-2 text-[12.5px] leading-[1.5] text-[#717480]"><b className="font-semibold text-[#4e515c]">Who can apply:</b> {item.eligibility.slice(0, 2).join(", ")}</p>
      )}
      <p className="mt-3 text-[12px] font-medium text-[#f27429]">Apply by {formatDay(item.closesAt)}</p>
      <Link href="/scholarships" className="mt-4 inline-flex h-[40px] items-center justify-center rounded-full bg-[#0B1F4D] text-[13px] font-semibold text-white transition hover:bg-[#13306f]">
        {item.application ? "See my application" : "Apply now"}
      </Link>
    </div>
  </article>
);

export const ScholarshipsCarousel: React.FC = () => {
  const scholarships = useQuery({ queryKey: ["lms.public.scholarships"], queryFn: lmsPublicApi.scholarships, staleTime: 60_000 });
  // Open ones first, then the ones that open soon; closed ones have no place on the home page
  const shown = (scholarships.data ?? [])
    .filter((item) => item.state !== "closed")
    .sort((a, b) => Number(b.state === "open") - Number(a.state === "open"))
    .slice(0, 3);

  return (
    <div className="relative flex w-full flex-col gap-8 overflow-hidden rounded-[24px] bg-gradient-to-br from-[#5b67a0] to-[#d6def4] px-6 py-10 shadow-sm md:rounded-[40px] md:px-10 md:py-12 lg:flex-row lg:items-center lg:gap-12 lg:px-12 lg:py-14">
      {/* Text */}
      <div className="z-10 flex w-full shrink-0 flex-col lg:w-[380px]">
        <h2 className="text-[28px] font-semibold leading-[1.2] text-white md:text-[36px] lg:text-[40px]">
          Apply for
          <br />
          Scholarships
        </h2>
        <p className="mt-4 max-w-[420px] text-[14px] leading-[1.65] text-white/90 lg:text-[15px]">
          We believe education should be open to everyone. Apply for a scholarship and get free access to premium courses and programs.
        </p>
        <ul className="mt-5 flex flex-col gap-2.5">
          {HOW_IT_WORKS.map((line) => (
            <li key={line} className="flex items-start gap-2.5 text-[13.5px] leading-[1.5] text-white/95">
              <FiCheckCircle aria-hidden className="mt-[3px] shrink-0 text-[15px] text-[#cfe0ff]" />
              {line}
            </li>
          ))}
        </ul>
        <Link
          href="/scholarships"
          className="mt-7 inline-flex h-[46px] w-fit items-center justify-center rounded-full border border-white px-7 text-[14px] font-semibold text-white transition hover:bg-white hover:text-[#5b67a0]"
        >
          View all scholarships
        </Link>
      </div>

      {/* Scholarships, with room for their pictures */}
      <div className="relative z-10 min-w-0 flex-1">
        {scholarships.isLoading ? (
          <div className="h-[340px] animate-pulse rounded-[18px] bg-white/30" />
        ) : shown.length > 0 ? (
          <div className="-mx-6 flex snap-x gap-4 overflow-x-auto px-6 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:-mx-10 md:px-10 sm:mx-0 sm:grid sm:grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0">
            {shown.map((item, index) => (
              <ScholarshipCard key={item.id} item={item} index={index} />
            ))}
          </div>
        ) : (
          // Nothing is open right now: show the pictures and say when to look again, instead of an empty box
          <div className="grid gap-4 sm:grid-cols-2">
            {IMAGES.map((image, index) => (
              <div key={index} className="overflow-hidden rounded-[18px] bg-white shadow-[0_10px_30px_rgba(11,31,77,0.14)]">
                <img src={image.src} alt="" className="h-[190px] w-full object-cover" />
                <div className="p-5">
                  <p className="text-[15px] font-bold text-[#202127]">{index === 0 ? "New scholarships are announced here" : "Applications open for a limited time"}</p>
                  <p className="mt-1.5 text-[13px] leading-[1.55] text-[#5b5e6b]">
                    {index === 0 ? "Nothing is open this minute. Check back soon, or see past and upcoming ones." : "Every scholarship has an opening and a closing date, so apply as soon as one opens."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
