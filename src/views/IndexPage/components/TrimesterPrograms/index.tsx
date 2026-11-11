"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import ComingSoon from "@components/ComingSoon";
import { formatDay } from "@components/Landing";
import { lmsPublicApi, type TPublicTrimester } from "@services/lmsPublic";

const price = (trimester: TPublicTrimester) =>
  trimester.price > 0 ? new Intl.NumberFormat("en-NG", { style: "currency", currency: trimester.currency, maximumFractionDigits: 0 }).format(trimester.price) : "Free";

const stateLabel = (trimester: TPublicTrimester) =>
  trimester.enrolled ? "You are enrolled" : trimester.enrolmentState === "open" ? "Enrolment open" : trimester.enrolmentState === "upcoming" ? "Opens soon" : "Enrolment closed";

// A short look at the published trimester programs, linking to each program's landing page, with a marker that more are coming
const ProgramTile = ({ trimester }: { trimester: TPublicTrimester }) => (
  <Link
    href={`/trimester/${trimester.id}`}
    className="group flex h-full min-w-0 flex-col overflow-hidden rounded-[20px] bg-[linear-gradient(120deg,#0B1F4D_0%,#1E4FC9_140%)] p-6 text-white transition-shadow hover:shadow-[0_10px_30px_rgba(11,31,77,0.3)]"
  >
    <div className="flex flex-wrap items-center gap-2">
      <span className="rounded-full bg-[#EFEAFD] px-2.5 py-0.5 text-[11px] font-bold text-[#5B3FC4]">4 weeks</span>
      <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-bold">{stateLabel(trimester)}</span>
    </div>
    <h3 className="mt-4 text-[22px] font-bold leading-[1.2]">{trimester.programName}</h3>
    <p className="mt-2 line-clamp-3 text-[14px] leading-[1.6] text-[#C9D5F0]">
      {trimester.description || "A guided four week program with live classes, assignments and a final project, finishing with a certificate."}
    </p>
    <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[13px]">
      <div><dt className="text-[#9fb3e8]">Starts</dt><dd className="font-semibold">{formatDay(trimester.startsAt)}</dd></div>
      <div><dt className="text-[#9fb3e8]">Fee</dt><dd className="font-semibold">{price(trimester)}</dd></div>
      {trimester.seatsLeft !== null && <div><dt className="text-[#9fb3e8]">Seats left</dt><dd className="font-semibold">{trimester.seatsLeft}</dd></div>}
    </dl>
    <span className="mt-auto inline-flex pt-6 text-[14px] font-semibold">View the program <span aria-hidden className="ml-1 transition-transform group-hover:translate-x-1">→</span></span>
  </Link>
);

const TrimesterPrograms = () => {
  const trimesters = useQuery({ queryKey: ["lms.public.trimesters"], queryFn: lmsPublicApi.trimesters, staleTime: 60_000 });
  const programs = trimesters.data ?? [];

  return (
    <section className="w-full" aria-labelledby="trimester-programs">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-[620px]">
          <h2 id="trimester-programs" className="text-[26px] font-bold leading-[1.15] text-[#202127] md:text-[32px]">Trimester programs</h2>
          <p className="mt-2 text-[14px] leading-[1.65] text-[#4e515c] md:text-[15px]">
            Guided, cohort based learning with live classes, assignments, a final project and a certificate.
          </p>
        </div>
        <Link href="/trimester" className="text-[14px] font-semibold text-[#0B1F4D] hover:underline">All trimester programs</Link>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-[clamp(14px,2vw,24px)]">
        {trimesters.isLoading ? (
          <div className="h-[260px] animate-pulse rounded-[20px] bg-[#eef1f8]" />
        ) : (
          programs.map((trimester) => <ProgramTile key={trimester.id} trimester={trimester} />)
        )}
        {!trimesters.isLoading && (
          <ComingSoon
            title={programs.length ? "More programs coming soon" : "Trimester programs are coming soon"}
            text={programs.length ? "New programs and cohorts are on the way." : "The first program is being prepared. Check back soon."}
            className="min-h-[260px] rounded-[20px]"
          />
        )}
      </div>
    </section>
  );
};

export default TrimesterPrograms;
