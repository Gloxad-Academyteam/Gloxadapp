"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { EmptyState, ErrorState, LoadingState } from "@components/Landing";
import { lmsPublicApi } from "@services/lmsPublic";
import ProgramLanding from "@pages/TrimesterPage/ProgramLanding";

// One trimester program's own landing page, at /trimester/<id>, like a course page
const TrimesterProgramPage = () => {
  const { id } = useParams<{ id: string }>()!;
  const program = useQuery({
    queryKey: ["lms.public.trimester", id],
    queryFn: () => lmsPublicApi.trimester(id),
    retry: false,
  });
  const notFound = (program.error as { response?: { status?: number } } | null)?.response?.status === 404;

  return (
    <div className="w-full bg-[#F3F6FB]">
      <main className="mx-auto min-h-[60vh] w-full max-w-[1240px] px-4 pb-20 pt-4 sm:px-6 md:pt-6">
        <nav aria-label="Breadcrumb" className="mb-3 flex items-center gap-2 px-1 text-[13px] text-[#52607A]">
          <Link href="/trimester" className="font-semibold text-[#0B1F4D] hover:underline">Trimester programs</Link>
          <span aria-hidden>/</span>
          <span className="truncate">{program.data?.trimester.programName ?? "Program"}</span>
        </nav>

        {program.isLoading ? (
          <LoadingState />
        ) : notFound ? (
          <EmptyState image="/images/trimester/empty-calendar.svg" title="Program not found" text="This program is not published, or the link is wrong. See every available program instead." href="/trimester" action="All trimester programs" />
        ) : program.isError || !program.data ? (
          <ErrorState onRetry={() => program.refetch()} />
        ) : (
          <ProgramLanding trimester={program.data.trimester} />
        )}
      </main>
    </div>
  );
};

export default TrimesterProgramPage;
