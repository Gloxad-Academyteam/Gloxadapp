"use client";

import { useQuery } from "@tanstack/react-query";
import CourseCard, { COURSE_GRID } from "@components/CourseCard";
import ComingSoon from "@components/ComingSoon";
import { CourseGridSkeleton } from "@components/CourseCard/Skeleton";
import { EmptyState, ErrorState, LoadingState, formatDay } from "@components/Landing";
import { lmsPublicApi, type TPublicTrimester } from "@services/lmsPublic";
import ProgramLanding from "./ProgramLanding";

const feeLabel = (trimester: TPublicTrimester) =>
  trimester.price > 0 ? new Intl.NumberFormat("en-NG", { style: "currency", currency: trimester.currency, maximumFractionDigits: 0 }).format(trimester.price) : "Free";

const stateLabel = (trimester: TPublicTrimester) =>
  trimester.enrolled ? "You are enrolled" : trimester.enrolmentState === "open" ? "Enrolment open" : trimester.enrolmentState === "upcoming" ? "Opens soon" : "Enrolment closed";

// With one published program this page is that program's landing page; with several it lists them as cards
const TrimesterPage = () => {
  const trimesters = useQuery({ queryKey: ["lms.public.trimesters"], queryFn: lmsPublicApi.trimesters });
  const programs = trimesters.data ?? [];

  if (programs.length === 1) {
    return (
      <div className="w-full bg-[#F3F6FB]">
        <main className="mx-auto min-h-[60vh] w-full max-w-[1240px] px-4 pb-20 pt-6 sm:px-6 md:pt-8">
          <div className="flex flex-col gap-8">
            <ProgramLanding trimester={programs[0]} />
            <ComingSoon variant="banner" title="More trimester courses are coming" text="New programs, cohorts and live classes will appear here as soon as they are published." />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="w-full bg-white">
      <main className="mx-auto min-h-[60vh] w-full max-w-[1512px] px-5 pb-20 pt-10 md:px-10 md:pt-14 lg:px-8 xl:px-[120px]">
        <header className="mb-8 max-w-[720px]">
          <h1 className="text-[28px] font-bold leading-[1.2] text-[#201633] md:text-[36px]">Trimester courses</h1>
          <p className="mt-3 text-[15px] leading-[1.7] text-[#5b5e6b]">
            Guided, cohort based learning: live classes, assignments, a final project and a certificate. Choose a course to see its weeks, schedule and how to enrol.
          </p>
        </header>

        {trimesters.isLoading ? (
          <CourseGridSkeleton count={3} />
        ) : trimesters.isError ? (
          <ErrorState onRetry={() => trimesters.refetch()} />
        ) : programs.length === 0 ? (
          <EmptyState image="/images/trimester/empty-calendar.svg" title="Trimester courses are not available yet" text="No trimester course has been published. Please check back soon. In the meantime every Gloxad course is free and self-paced." href="/free" action="Browse free courses" />
        ) : (
          <div className={COURSE_GRID}>
            {programs.map((trimester) => (
              <CourseCard
                key={trimester.id}
                href={`/trimester/${trimester.id}`}
                title={trimester.programName}
                image="/images/trimester/trimester-card.svg"
                provider="Gloxad Academy"
                tag="Trimester course"
                meta={["4 weeks", `Starts ${formatDay(trimester.startsAt)}`, stateLabel(trimester)]}
                priceLabel={feeLabel(trimester)}
              />
            ))}
            <ComingSoon title="More courses coming soon" text="New trimester courses will be listed here as they are published." />
          </div>
        )}
      </main>
    </div>
  );
};

export default TrimesterPage;
