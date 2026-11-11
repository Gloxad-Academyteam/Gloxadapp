"use client";

import { useQuery } from "@tanstack/react-query";
import CourseCard, { COURSE_GRID } from "@components/CourseCard";
import ComingSoon from "@components/ComingSoon";
import { EmptyState, ErrorState, LoadingState, formatDay } from "@components/Landing";
import { lmsPublicApi, type TPublicTrimester } from "@services/lmsPublic";

const feeLabel = (trimester: TPublicTrimester) =>
  trimester.price > 0 ? new Intl.NumberFormat("en-NG", { style: "currency", currency: trimester.currency, maximumFractionDigits: 0 }).format(trimester.price) : "Free";

const stateLabel = (trimester: TPublicTrimester) =>
  trimester.enrolled ? "You are enrolled" : trimester.enrolmentState === "open" ? "Enrolment open" : trimester.enrolmentState === "upcoming" ? "Opens soon" : "Enrolment closed";

// Every published trimester program, as a card that opens the program's own landing page, the way a course does
const TrimesterPage = () => {
  const trimesters = useQuery({ queryKey: ["lms.public.trimesters"], queryFn: lmsPublicApi.trimesters });

  return (
    <div className="w-full bg-white">
      <main className="mx-auto min-h-[60vh] w-full max-w-[1512px] px-5 pb-20 pt-10 md:px-10 md:pt-14 lg:px-8 xl:px-[120px]">
        <header className="mb-8 max-w-[720px]">
          <h1 className="text-[28px] font-bold leading-[1.2] text-[#201633] md:text-[36px]">Trimester programs</h1>
          <p className="mt-3 text-[15px] leading-[1.7] text-[#5b5e6b]">
            Guided, cohort based learning: live classes, assignments, a final project and a certificate. Choose a program to see its weeks, schedule and how to enrol.
          </p>
        </header>

        {trimesters.isLoading ? (
          <LoadingState />
        ) : trimesters.isError ? (
          <ErrorState onRetry={() => trimesters.refetch()} />
        ) : !trimesters.data?.length ? (
          <EmptyState image="/images/trimester/empty-calendar.svg" title="Trimester programs are not available yet" text="No program has been published. Please check back soon. In the meantime every Gloxad course is free and self-paced." href="/free" action="Browse free courses" />
        ) : (
          <div className={COURSE_GRID}>
            {trimesters.data.map((trimester) => (
              <CourseCard
                key={trimester.id}
                href={`/trimester/${trimester.id}`}
                title={trimester.programName}
                image="/images/trimester/trimester-card.svg"
                provider="Gloxad Academy"
                tag="Trimester program"
                meta={["4 weeks", `Starts ${formatDay(trimester.startsAt)}`, stateLabel(trimester)]}
                priceLabel={feeLabel(trimester)}
              />
            ))}
            <ComingSoon title="More programs coming soon" text="New programs and cohorts will be listed here as they are published." />
          </div>
        )}
      </main>
    </div>
  );
};

export default TrimesterPage;
