"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import useAuth from "@hooks/useAuth";
import { EmptyState, ErrorState, LandingPage, LoadingState, formatDay } from "@components/Landing";
import { errorMessage, lmsPublicApi, type TPublicTrimester, type TPublicWeek } from "@services/lmsPublic";

const WEEKS_FALLBACK = ["Learn", "Practice", "Build", "Final project"];

// The four-week journey comes from the published plan; the labels only fill in until the admin has added weeks
const Journey = ({ weeks }: { weeks: TPublicWeek[] }) => (
  <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {(weeks.length ? weeks : WEEKS_FALLBACK.map((title, index) => ({ weekNumber: index + 1, title, text: "", estimatedHours: 0, concepts: [] }))).map((week) => (
      <li key={week.weekNumber} className="rounded-2xl border border-[#e5e7ef] bg-white p-5">
        <span className="text-[12px] font-bold uppercase tracking-wider text-[#2563eb]">Week {week.weekNumber}</span>
        <h3 className="mt-2 text-[16px] font-semibold text-[#201633]">{week.title}</h3>
        {week.text && <p className="mt-2 line-clamp-3 text-[13px] leading-[1.6] text-[#5b5e6b]">{week.text}</p>}
        {week.estimatedHours > 0 && <p className="mt-3 text-[12px] text-[#717480]">About {week.estimatedHours} hours</p>}
      </li>
    ))}
  </ol>
);

const price = (trimester: TPublicTrimester) =>
  trimester.price > 0 ? new Intl.NumberFormat("en-NG", { style: "currency", currency: trimester.currency, maximumFractionDigits: 0 }).format(trimester.price) : "Free";

// What the button says depends on who is looking and the enrolment window, which the server decides
const ProgramCard = ({ trimester }: { trimester: TPublicTrimester }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { authenticatedUser } = useAuth();
  const weeks = useQuery({ queryKey: ["lms.public.trimester", trimester.id], queryFn: () => lmsPublicApi.trimester(trimester.id) });

  const enrol = useMutation({
    mutationFn: () => lmsPublicApi.enrol(trimester.id),
    onSuccess: () => {
      toast.success("You are enrolled. Welcome to the trimester!");
      queryClient.invalidateQueries({ queryKey: ["lms.public.trimesters"] });
      router.push("/lms");
    },
    onError: (error) => toast.error(errorMessage(error)),
  });

  let action: React.ReactNode;
  if (trimester.enrolled) {
    action = <Link href="/lms" className="inline-flex h-[46px] items-center rounded-full bg-[#07004d] px-7 text-[14px] font-semibold text-white hover:bg-[#111456]">Continue learning</Link>;
  } else if (trimester.enrolmentState === "closed") {
    action = <p className="rounded-full bg-[#f4f5fa] px-5 py-3 text-[13px] font-medium text-[#5b5e6b]">Enrolment is closed</p>;
  } else if (trimester.enrolmentState === "upcoming") {
    action = <p className="rounded-full bg-[#fff4e5] px-5 py-3 text-[13px] font-medium text-[#b45309]">Enrolment opens on {formatDay(trimester.enrollmentOpensAt)}</p>;
  } else if (!authenticatedUser) {
    action = <Link href={`/auth/signin?redirect=/trimester`} className="inline-flex h-[46px] items-center rounded-full bg-[#07004d] px-7 text-[14px] font-semibold text-white hover:bg-[#111456]">Sign in to enrol</Link>;
  } else if (authenticatedUser.role !== "student") {
    action = <p className="rounded-full bg-[#f4f5fa] px-5 py-3 text-[13px] font-medium text-[#5b5e6b]">Only students can enrol</p>;
  } else {
    action = (
      <button type="button" disabled={enrol.isPending} onClick={() => enrol.mutate()} className="h-[46px] rounded-full bg-[#07004d] px-7 text-[14px] font-semibold text-white transition hover:bg-[#111456] disabled:opacity-60">
        {enrol.isPending ? "Enrolling..." : "Enrol now"}
      </button>
    );
  }

  return (
    <article className="rounded-[24px] border border-[#e5e7ef] bg-[#f8f9fd] p-6 md:p-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-[620px]">
          <span className="text-[12px] font-bold uppercase tracking-wider text-[#2563eb]">{trimester.name}</span>
          <h2 className="mt-2 text-[24px] font-bold text-[#201633] md:text-[28px]">{trimester.programName}</h2>
          <p className="mt-3 text-[14px] leading-[1.7] text-[#5b5e6b]">
            Four weeks of guided learning, practice, live classes and a final project, finishing with a certificate.
          </p>
          <dl className="mt-5 grid grid-cols-2 gap-x-8 gap-y-3 text-[13px] sm:grid-cols-3">
            <div><dt className="text-[#717480]">Starts</dt><dd className="font-semibold text-[#201633]">{formatDay(trimester.startsAt)}</dd></div>
            <div><dt className="text-[#717480]">Ends</dt><dd className="font-semibold text-[#201633]">{formatDay(trimester.endsAt)}</dd></div>
            <div><dt className="text-[#717480]">Fee</dt><dd className="font-semibold text-[#201633]">{price(trimester)}</dd></div>
            {trimester.enrollmentClosesAt && <div><dt className="text-[#717480]">Enrol by</dt><dd className="font-semibold text-[#201633]">{formatDay(trimester.enrollmentClosesAt)}</dd></div>}
          </dl>
        </div>
        <div className="shrink-0">{action}</div>
      </div>
      <h3 className="mt-8 text-[16px] font-semibold text-[#201633]">The four week journey</h3>
      <Journey weeks={weeks.data?.weeks ?? []} />
    </article>
  );
};

const TrimesterPage = () => {
  const trimesters = useQuery({ queryKey: ["lms.public.trimesters"], queryFn: lmsPublicApi.trimesters });

  return (
    <LandingPage title="Trimester Program" intro="A guided, cohort based program: learn, practice, join live classes and build a final project over four weeks, with an instructor and a certificate at the end.">
      {trimesters.isLoading ? (
        <LoadingState />
      ) : trimesters.isError ? (
        <ErrorState onRetry={() => trimesters.refetch()} />
      ) : !trimesters.data?.length ? (
        <EmptyState title="No trimester is open yet" text="The next trimester has not been published. In the meantime every Gloxad course is free and self-paced." href="/free" action="Browse free courses" />
      ) : (
        <div className="flex flex-col gap-8">
          {trimesters.data.map((trimester) => (
            <ProgramCard key={trimester.id} trimester={trimester} />
          ))}
        </div>
      )}
    </LandingPage>
  );
};

export default TrimesterPage;
