"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import ComingSoon from "@components/ComingSoon";
import { formatDay } from "@components/Landing";
import { lmsPublicApi, type TPublicTrimester } from "@services/lmsPublic";

const fee = (trimester: TPublicTrimester) =>
  trimester.price > 0 ? new Intl.NumberFormat("en-NG", { style: "currency", currency: trimester.currency, maximumFractionDigits: 0 }).format(trimester.price) : "Free";

const status = (trimester: TPublicTrimester) =>
  trimester.enrolled ? "You are enrolled" : trimester.enrolmentState === "open" ? "Enrolment open" : trimester.enrolmentState === "upcoming" ? "Opens soon" : "Enrolment closed";

// A preview of a trimester course's landing page: what it is, the key facts, and a way in
const Banner = ({ trimester }: { trimester: TPublicTrimester }) => (
  <article className="relative overflow-hidden rounded-[24px] bg-[linear-gradient(120deg,#0B1F4D_0%,#1E4FC9_140%)] px-6 py-9 text-white md:rounded-[32px] md:px-10 md:py-11 lg:px-12">
    <span aria-hidden className="absolute -right-16 -top-16 h-[260px] w-[260px] rounded-full bg-white/[0.07]" />
    <img src="/images/trimester/hero-learning.svg" alt="" aria-hidden className="pointer-events-none absolute bottom-3 right-6 hidden h-[88%] max-h-[330px] w-auto lg:block" />
    <div className="relative lg:max-w-[52%]">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-[#EFEAFD] px-2.5 py-0.5 text-[11px] font-bold text-[#5B3FC4]">4 weeks</span>
        <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-bold">Trimester course</span>
        <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-bold">{status(trimester)}</span>
      </div>
      <h3 className="text-[26px] font-bold leading-[1.2] md:text-[32px]">{trimester.programName}</h3>
      <p className="mt-3 max-w-[560px] text-[14px] leading-[1.65] text-[#C9D5F0] md:text-[15px]">
        {trimester.description || "A guided four week course with live classes, assignments and a final project, finishing with a certificate."}
      </p>
      <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-3 text-[13px]">
        <div><dt className="text-[#9fb3e8]">Starts</dt><dd className="font-semibold">{formatDay(trimester.startsAt)}</dd></div>
        <div><dt className="text-[#9fb3e8]">Fee</dt><dd className="font-semibold">{fee(trimester)}</dd></div>
        {trimester.seatsLeft !== null && <div><dt className="text-[#9fb3e8]">Seats left</dt><dd className="font-semibold">{trimester.seatsLeft}</dd></div>}
      </dl>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/trimester" className="inline-flex h-[46px] items-center rounded-full bg-white px-7 text-[14px] font-bold text-[#0B1F4D] transition hover:bg-[#eef2ff]">
          View the course
        </Link>
        <Link href="/scholarships" className="inline-flex h-[46px] items-center rounded-full bg-white/[0.18] px-7 text-[14px] font-bold text-white transition hover:bg-white/25">
          See scholarships
        </Link>
      </div>
    </div>
  </article>
);

const TrimesterLanding = () => {
  const trimesters = useQuery({ queryKey: ["lms.public.trimesters"], queryFn: lmsPublicApi.trimesters, staleTime: 60_000 });
  const programs = (trimesters.data ?? []).slice(0, 2);

  return (
    <section className="w-full" aria-labelledby="trimester-courses">
      <div className="mb-6 max-w-[640px]">
        <h2 id="trimester-courses" className="text-[26px] font-bold leading-[1.15] text-[#202127] md:text-[32px]">Trimester courses</h2>
        <p className="mt-2 text-[14px] leading-[1.65] text-[#4e515c] md:text-[15px]">
          Guided, cohort based learning with live classes, assignments, a final project and a certificate.
        </p>
      </div>

      {trimesters.isLoading ? (
        <div className="h-[300px] animate-pulse rounded-[24px] bg-[#eef1f8]" />
      ) : programs.length > 0 ? (
        <div className="flex flex-col gap-5">{programs.map((trimester) => <Banner key={trimester.id} trimester={trimester} />)}</div>
      ) : (
        <ComingSoon variant="banner" title="Trimester courses are coming soon" text="The first course is being prepared. Check back soon." />
      )}
    </section>
  );
};

export default TrimesterLanding;
