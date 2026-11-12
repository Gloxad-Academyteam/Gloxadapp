"use client";

import Link from "next/link";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import useAuth from "@hooks/useAuth";
import { EmptyState, ErrorState, LandingPage, LoadingState, formatDay } from "@components/Landing";
import { errorMessage, lmsPublicApi, type TApplicationStatus, type TPublicScholarship } from "@services/lmsPublic";

// Four statuses stay separate: submitted, reviewed, decided and completed. "Rejected" is a finished answer, not a failure of the form.
const STATUS_LABEL: Record<TApplicationStatus, { text: string; tone: string }> = {
  draft: { text: "Draft", tone: "bg-[#f4f5fa] text-[#5b5e6b]" },
  submitted: { text: "Submitted", tone: "bg-[#e8f0ff] text-[#1d4ed8]" },
  under_review: { text: "Under review", tone: "bg-[#fff4e5] text-[#b45309]" },
  shortlisted: { text: "Shortlisted", tone: "bg-[#efe9ff] text-[#6d28d9]" },
  approved: { text: "Approved", tone: "bg-[#e6f6ec] text-[#15803d]" },
  rejected: { text: "Not successful", tone: "bg-[#fdecec] text-[#b91c1c]" },
  withdrawn: { text: "Withdrawn", tone: "bg-[#f4f5fa] text-[#5b5e6b]" },
  closed: { text: "Closed", tone: "bg-[#f4f5fa] text-[#5b5e6b]" },
};

const ApplyForm = ({ scholarship, onDone }: { scholarship: TPublicScholarship; onDone: () => void }) => {
  const [statement, setStatement] = useState("");
  const apply = useMutation({
    mutationFn: () => lmsPublicApi.apply(scholarship.id, { statement }),
    onSuccess: () => {
      toast.success("Application submitted");
      onDone();
    },
    onError: (error) => toast.error(errorMessage(error)),
  });

  return (
    <form
      className="mt-5 rounded-2xl border border-[#e5e7ef] bg-[#f8f9fd] p-5"
      onSubmit={(event) => {
        event.preventDefault();
        apply.mutate();
      }}
    >
      <label htmlFor={`statement-${scholarship.id}`} className="text-[14px] font-semibold text-[#201633]">Why should we award you this scholarship?</label>
      <textarea
        id={`statement-${scholarship.id}`}
        required
        minLength={30}
        maxLength={3000}
        rows={5}
        value={statement}
        onChange={(event) => setStatement(event.target.value)}
        className="mt-2 w-full rounded-xl border border-[#d7d9e4] bg-white p-3 text-[14px] outline-none focus:border-[#07004d]"
        placeholder="Tell us about your goals and why this matters to you (at least 30 characters)"
      />
      {scholarship.requiredDocuments.length > 0 && (
        <p className="mt-2 text-[12px] text-[#717480]">You may be asked for: {scholarship.requiredDocuments.join(", ")}.</p>
      )}
      <button type="submit" disabled={apply.isPending} className="mt-4 h-[44px] rounded-full bg-[#07004d] px-7 text-[14px] font-semibold text-white hover:bg-[#111456] disabled:opacity-60">
        {apply.isPending ? "Submitting..." : "Submit application"}
      </button>
    </form>
  );
};

const ScholarshipCard = ({ scholarship }: { scholarship: TPublicScholarship }) => {
  const { authenticatedUser } = useAuth();
  const queryClient = useQueryClient();
  const [applying, setApplying] = useState(false);
  const application = scholarship.application;

  let action: React.ReactNode = null;
  if (application) {
    const status = STATUS_LABEL[application.status];
    action = (
      <div className="text-right">
        <span className={`inline-block rounded-full px-4 py-1.5 text-[12px] font-semibold ${status.tone}`}>{status.text}</span>
        {application.latest?.note && <p className="mt-2 max-w-[240px] text-[12px] text-[#5b5e6b]">{application.latest.note}</p>}
      </div>
    );
  } else if (scholarship.state === "upcoming") {
    action = <p className="rounded-full bg-[#fff4e5] px-5 py-2.5 text-[13px] font-medium text-[#b45309]">Opens on {formatDay(scholarship.opensAt)}</p>;
  } else if (scholarship.state === "closed") {
    action = <p className="rounded-full bg-[#f4f5fa] px-5 py-2.5 text-[13px] font-medium text-[#5b5e6b]">Closed on {formatDay(scholarship.closesAt)}</p>;
  } else if (!authenticatedUser) {
    action = <Link href="/login?redirect=/scholarships" className="inline-flex h-[44px] items-center rounded-full bg-[#07004d] px-7 text-[14px] font-semibold text-white hover:bg-[#111456]">Sign in to apply</Link>;
  } else {
    action = (
      <button type="button" onClick={() => setApplying((open) => !open)} className="h-[44px] rounded-full bg-[#07004d] px-7 text-[14px] font-semibold text-white hover:bg-[#111456]">
        {applying ? "Cancel" : "Apply now"}
      </button>
    );
  }

  return (
    <article className="rounded-2xl border border-[#e5e7ef] bg-white p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-[620px]">
          <h2 className="text-[20px] font-bold text-[#201633]">{scholarship.title}</h2>
          {scholarship.summary && <p className="mt-1 text-[14px] font-medium text-[#2563eb]">{scholarship.summary}</p>}
          {scholarship.description && <p className="mt-3 text-[14px] leading-[1.7] text-[#5b5e6b]">{scholarship.description}</p>}
        </div>
        <div className="shrink-0">{action}</div>
      </div>
      <dl className="mt-5 grid gap-5 text-[13px] sm:grid-cols-3">
        <div><dt className="text-[#717480]">Application window</dt><dd className="font-semibold text-[#201633]">{formatDay(scholarship.opensAt)} to {formatDay(scholarship.closesAt)}</dd></div>
        {scholarship.eligibility.length > 0 && (
          <div><dt className="text-[#717480]">Who can apply</dt><dd><ul className="list-disc pl-4 text-[#201633]">{scholarship.eligibility.map((rule) => <li key={rule}>{rule}</li>)}</ul></dd></div>
        )}
        {scholarship.requiredDocuments.length > 0 && (
          <div><dt className="text-[#717480]">Documents</dt><dd><ul className="list-disc pl-4 text-[#201633]">{scholarship.requiredDocuments.map((doc) => <li key={doc}>{doc}</li>)}</ul></dd></div>
        )}
      </dl>
      {applying && !application && (
        <ApplyForm
          scholarship={scholarship}
          onDone={() => {
            setApplying(false);
            queryClient.invalidateQueries({ queryKey: ["lms.public.scholarships"] });
          }}
        />
      )}
    </article>
  );
};

const ScholarshipsPage = () => {
  const scholarships = useQuery({ queryKey: ["lms.public.scholarships"], queryFn: lmsPublicApi.scholarships });

  return (
    <LandingPage title="Scholarships" intro="Open, upcoming and closed scholarships. Apply while the window is open and follow the status of your application here.">
      {scholarships.isLoading ? (
        <LoadingState />
      ) : scholarships.isError ? (
        <ErrorState title="Scholarships are temporarily unavailable" description="We could not fetch the latest scholarship and application details. Check your connection, then try again." onRetry={() => scholarships.refetch()} />
      ) : !scholarships.data?.length ? (
        <EmptyState title="No scholarships are published right now" text="New scholarships will appear here as soon as they are announced." href="/free" action="Browse free courses" />
      ) : (
        <div className="flex flex-col gap-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <figure className="overflow-hidden rounded-2xl border border-[#e5e7ef] bg-white">
              <img src="/images/trimester/photos/scholarship-accepted.webp" alt="A learner in Lagos laughing in disbelief as she reads her scholarship message" loading="lazy" className="h-[220px] w-full object-cover" />
              <figcaption className="p-4 text-[13.5px] leading-[1.6] text-[#5b5e6b]">Scholarships are for learners who are ready to work but cannot cover the fee alone.</figcaption>
            </figure>
            <figure className="overflow-hidden rounded-2xl border border-[#e5e7ef] bg-white">
              <img src="/images/trimester/photos/scholarship-family.webp" alt="A mother wiping away happy tears as her daughter shows her the good news on a laptop" loading="lazy" className="h-[220px] w-full object-cover" />
              <figcaption className="p-4 text-[13.5px] leading-[1.6] text-[#5b5e6b]">Apply while the window is open. We tell you the outcome here and by email.</figcaption>
            </figure>
          </div>
          {scholarships.data.map((scholarship) => (
            <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
          ))}
        </div>
      )}
    </LandingPage>
  );
};

export default ScholarshipsPage;
