"use client";

import UserAvatar from "@components/Avatar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import useAuth from "@hooks/useAuth";
import { formatClassTime, formatDay } from "@components/Landing";
import { errorMessage, lmsPublicApi, type TPublicTrimester } from "@services/lmsPublic";

// Every week of the program has the same five day rhythm; only the content changes
const RHYTHM = [
  { day: "Mon", label: "Learning" },
  { day: "Tue", label: "Practice" },
  { day: "Wed", label: "Instructor Session", live: true },
  { day: "Thu", label: "Applied Learning" },
  { day: "Fri", label: "Assessment" },
];
const ACTIVITIES = ["Watch lessons", "Read notes", "Code in a sandbox", "Take quizzes", "Join live classes", "Submit assignments", "Discuss with peers", "Build a final project", "Earn a certificate"];

const card = "rounded-[14px] border border-[#DCE5F7] bg-white p-5 shadow-[0_6px_22px_rgba(11,31,77,0.08)]";
const sectionTitle = "mb-3 text-[14px] font-bold text-[#0B1F4D]";

const Badge = ({ children, tone = "blue" }: { children: React.ReactNode; tone?: "blue" | "green" | "amber" | "grey" | "purple" | "glass" }) => {
  const tones = {
    blue: "bg-[#DBE6FB] text-[#1D4ED8]",
    green: "bg-[#E1F4EA] text-[#0B6B45]",
    amber: "bg-[#FFF0CF] text-[#7A4E00]",
    grey: "bg-[#EAEEF6] text-[#52607A]",
    purple: "bg-[#EFEAFD] text-[#5B3FC4]",
    glass: "bg-white/15 text-white",
  };
  return <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-bold ${tones[tone]}`}>{children}</span>;
};

const money = (trimester: TPublicTrimester) =>
  trimester.price > 0 ? new Intl.NumberFormat("en-NG", { style: "currency", currency: trimester.currency, maximumFractionDigits: 0 }).format(trimester.price) : "Free";


// The page for one program. What the main button says depends on who is looking and on the enrolment window, which the server decides.
export const ProgramLanding = ({ trimester }: { trimester: TPublicTrimester }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { authenticatedUser } = useAuth();
  const detail = useQuery({ queryKey: ["lms.public.trimester", trimester.id], queryFn: () => lmsPublicApi.trimester(trimester.id) });

  const enrol = useMutation({
    mutationFn: () => lmsPublicApi.enrol(trimester.id),
    onSuccess: () => {
      toast.success("You are enrolled. Welcome to the trimester!");
      queryClient.invalidateQueries({ queryKey: ["lms.public.trimesters"] });
      router.push("/lms");
    },
    onError: (error) => toast.error(errorMessage(error)),
  });

  const primary = "inline-flex h-[50px] items-center rounded-full bg-white px-8 text-[15px] font-bold text-[#0B1F4D] transition hover:bg-[#eef2ff]";
  const inactive = "inline-flex h-[50px] items-center rounded-full bg-white/20 px-8 text-[14px] font-semibold text-white/85";
  let cta: React.ReactNode;
  if (trimester.enrolled) {
    cta = <Link href="/lms" className={primary}>Continue learning</Link>;
  } else if (trimester.enrolmentState === "closed") {
    cta = <span className={inactive}>Enrolment closed</span>;
  } else if (trimester.enrolmentState === "upcoming") {
    cta = <span className={inactive}>Enrolment opens {formatDay(trimester.enrollmentOpensAt)}</span>;
  } else if (!authenticatedUser) {
    cta = <Link href="/auth/signin?redirect=/trimester" className={primary}>Sign in to enrol</Link>;
  } else if (authenticatedUser.role !== "student") {
    cta = <span className={inactive}>Only students can enrol</span>;
  } else {
    cta = (
      <button type="button" disabled={enrol.isPending} onClick={() => enrol.mutate()} className={`${primary} disabled:opacity-70`}>
        {enrol.isPending ? "Enrolling..." : "Enrol now"}
      </button>
    );
  }

  const coverImage = trimester.thumbnail || "/images/trimester/photos/cover-default.webp";
  const weeks = detail.data?.weeks ?? [];
  const sessions = detail.data?.sessions ?? [];
  const instructors = detail.data?.instructors ?? [];
  const stateBadge =
    trimester.enrolmentState === "open" ? <Badge tone="green">Open</Badge> : trimester.enrolmentState === "upcoming" ? <Badge tone="amber">Opens soon</Badge> : <Badge tone="grey">Closed</Badge>;

  return (
    <article className="flex flex-col gap-4">
      {/* Hero */}
      <header className="relative overflow-hidden rounded-[20px] bg-[linear-gradient(120deg,#0B1F4D_0%,#1E4FC9_140%)] px-6 py-10 text-white sm:px-10 sm:py-11">
        <span aria-hidden className="absolute -right-16 -top-16 h-[260px] w-[260px] rounded-full bg-white/[0.07]" />
        {/* The cover the tutor uploaded, or a default photo until they do */}
        <img src={coverImage} alt="" className="absolute bottom-6 right-6 top-6 hidden w-[38%] rounded-[16px] object-cover shadow-[0_18px_40px_rgba(0,0,0,0.35)] lg:block" />
        <div className="relative lg:max-w-[56%]">
          <img src={coverImage} alt="" className="mb-5 block h-[170px] w-full rounded-[14px] object-cover shadow-[0_12px_28px_rgba(0,0,0,0.3)] lg:hidden" />
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge tone="purple">{trimester.weeks ?? 12} weeks</Badge>
            <Badge tone="glass">{trimester.name}</Badge>
            {trimester.level && <Badge tone="glass">{trimester.level.replace("-", " ")}</Badge>}
            {trimester.language && <Badge tone="glass">{trimester.language}</Badge>}
          </div>
          <h1 className="max-w-[640px] text-[26px] font-bold leading-[1.2] sm:text-[34px]">{trimester.programName}</h1>
          <p className="mb-6 mt-3 max-w-[620px] text-[15px] leading-[1.6] text-[#C9D5F0] sm:text-[16px]">
            {trimester.description || "A guided four week journey: learn, practise, join live classes, build and submit, and finish with a certificate."}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {cta}
            {trimester.trailerUrl && (
              <a href={trimester.trailerUrl} target="_blank" rel="noopener noreferrer" className="inline-flex h-[50px] items-center rounded-full border border-white/40 px-7 text-[15px] font-bold text-white transition hover:bg-white/10">
                Watch the trailer
              </a>
            )}
            <Link href="/scholarships" className="inline-flex h-[50px] items-center rounded-full bg-white/[0.18] px-8 text-[15px] font-bold text-white transition hover:bg-white/25">
              See scholarships
            </Link>
          </div>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        {/* Left: the journey */}
        <section className={card}>
          <h2 className={sectionTitle}>Week by week</h2>
          {detail.isLoading ? (
            <div className="grid gap-3 sm:grid-cols-2">{[0, 1, 2, 3].map((i) => <div key={i} className="h-[96px] animate-pulse rounded-[14px] bg-[#F3F6FB]" />)}</div>
          ) : weeks.length === 0 ? (
            <p className="rounded-[14px] bg-[#F3F6FB] p-4 text-[13px] text-[#52607A]">The week by week plan will appear here as soon as it is published.</p>
          ) : (
            <ol className="grid gap-3 sm:grid-cols-2">
              {weeks.map((week) => (
                <li key={week.weekNumber} className="overflow-hidden rounded-[14px] bg-[#F3F6FB]">
                  <img src={`/images/trimester/photos/week-${((week.weekNumber - 1) % 4) + 1}.webp`} alt="" loading="lazy" className="h-[120px] w-full object-cover" />
                  <div className="p-4">
                  <Badge>Week {week.weekNumber}</Badge>
                  <h3 className="mt-2 text-[15px] font-bold text-[#0B1F4D]">{week.title}</h3>
                  {week.text && <p className="mt-1 line-clamp-3 text-[12.5px] leading-[1.5] text-[#52607A]">{week.text}</p>}
                  {week.estimatedHours > 0 && <p className="mt-2 text-[11.5px] text-[#52607A]">About {week.estimatedHours} hours</p>}
                  </div>
                </li>
              ))}
            </ol>
          )}

          <hr className="my-5 border-[#DCE5F7]" />
          <h2 className={sectionTitle}>Every week follows the same rhythm</h2>
          <div className="flex flex-wrap gap-1.5">
            {RHYTHM.map((item) => (
              <span key={item.day} className={`rounded-full px-3.5 py-1.5 text-[12px] font-semibold text-white ${item.live ? "bg-[#FF5A5F]" : "bg-[#0B1F4D]"}`}>
                {item.day}: {item.label}
              </span>
            ))}
          </div>

          <hr className="my-5 border-[#DCE5F7]" />
          <h2 className={sectionTitle}>What you will do</h2>
          <div className="flex flex-wrap gap-1.5">
            {ACTIVITIES.map((item) => (
              <span key={item} className="rounded-full border-[1.5px] border-[#DCE5F7] bg-white px-3.5 py-1.5 text-[12px] font-semibold text-[#52607A]">{item}</span>
            ))}
          </div>

          <hr className="my-5 border-[#DCE5F7]" />
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <img src="/images/trimester/photos/learn-anywhere.webp" alt="" loading="lazy" className="h-[150px] w-full rounded-[14px] object-cover sm:w-[220px] sm:shrink-0" />
            <div>
              <h2 className="mb-1.5 text-[14px] font-bold text-[#0B1F4D]">Learn where life happens</h2>
              <p className="text-[13.5px] leading-[1.6] text-[#37456b]">Lessons, notes and quizzes work on your phone, so the commute home or a break between jobs can be study time too.</p>
            </div>
          </div>

          <hr className="my-5 border-[#DCE5F7]" />
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <img src="/images/trimester/photos/mentor-session.webp" alt="A tutor and a learner reviewing her work together at a laptop" loading="lazy" className="h-[150px] w-full rounded-[14px] object-cover sm:w-[220px] sm:shrink-0" />
            <div>
              <h2 className="mb-1.5 text-[14px] font-bold text-[#0B1F4D]">Tutors you can actually talk to</h2>
              <p className="text-[13.5px] leading-[1.6] text-[#37456b]">Live classes, feedback on your assignments and a support line when you get stuck, so nobody learns alone.</p>
            </div>
          </div>

          <hr className="my-5 border-[#DCE5F7]" />
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <img src="/images/trimester/photos/certificate.webp" alt="A learner holding a Gloxad Academy certificate" loading="lazy" className="h-[150px] w-full rounded-[14px] object-cover sm:w-[220px] sm:shrink-0" />
            <div>
              <h2 className="mb-1.5 text-[14px] font-bold text-[#0B1F4D]">Finish with a certificate you can show</h2>
              <p className="text-[13.5px] leading-[1.6] text-[#37456b]">Complete the weeks and your final project and you earn a certificate with a number anyone can check.</p>
            </div>
          </div>

          {(trimester.skills?.length ?? 0) > 0 && (
            <>
              <hr className="my-5 border-[#DCE5F7]" />
              <h2 className={sectionTitle}>What you will learn</h2>
              <ul className="grid gap-2 sm:grid-cols-2">
                {trimester.skills!.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[13.5px] leading-[1.5] text-[#1F2A44]">
                    <span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#1D4ED8]" />
                    {item}
                  </li>
                ))}
              </ul>
            </>
          )}
          {(trimester.targetAudience?.length ?? 0) > 0 && (
            <>
              <hr className="my-5 border-[#DCE5F7]" />
              <h2 className={sectionTitle}>Who this is for</h2>
              <ul className="flex flex-col gap-1.5 text-[13.5px] leading-[1.5] text-[#1F2A44]">
                {trimester.targetAudience!.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </>
          )}
          {(trimester.requirements?.length ?? 0) > 0 && (
            <>
              <hr className="my-5 border-[#DCE5F7]" />
              <h2 className={sectionTitle}>Requirements</h2>
              <ul className="flex flex-col gap-1.5 text-[13.5px] leading-[1.5] text-[#1F2A44]">
                {trimester.requirements!.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </>
          )}
        </section>

        {/* Right: registration, schedule, instructors */}
        <div className="flex flex-col gap-4">
          <section className={card}>
            <h2 className={sectionTitle}>Registration</h2>
            <dl className="flex flex-col gap-2.5 text-[13px]">
              <div className="flex items-center justify-between gap-3"><dt className="text-[#52607A]">Starts</dt><dd className="font-bold text-[#1F2A44]">{formatDay(trimester.startsAt)}</dd></div>
              <div className="flex items-center justify-between gap-3"><dt className="text-[#52607A]">Ends</dt><dd className="font-bold text-[#1F2A44]">{formatDay(trimester.endsAt)}</dd></div>
              {trimester.enrollmentClosesAt && (
                <div className="flex items-center justify-between gap-3"><dt className="text-[#52607A]">Enrol by</dt><dd className="font-bold text-[#1F2A44]">{formatDay(trimester.enrollmentClosesAt)}</dd></div>
              )}
              {trimester.seats && trimester.seatsLeft !== null && (
                <div className="flex items-center justify-between gap-3"><dt className="text-[#52607A]">Seats</dt><dd className="font-bold text-[#1F2A44]">{trimester.seatsLeft} of {trimester.seats} left</dd></div>
              )}
              <div className="flex items-center justify-between gap-3"><dt className="text-[#52607A]">Fee</dt><dd className="font-bold text-[#1F2A44]">{money(trimester)}</dd></div>
              <div className="flex items-center justify-between gap-3"><dt className="text-[#52607A]">Enrolment</dt><dd>{stateBadge}</dd></div>
            </dl>
          </section>

          <section className={card}>
            <img src="/images/trimester/photos/live-class.webp" alt="" loading="lazy" className="mb-4 h-[150px] w-full rounded-[12px] object-cover" />
            <h2 className={sectionTitle}>Live class schedule</h2>
            {sessions.length === 0 ? (
              <p className="text-[13px] text-[#52607A]">Class times will be announced soon.</p>
            ) : (
              <ul className="flex flex-col gap-2 text-[13px]">
                {sessions.map((session) => (
                  <li key={session.id} className="flex items-start justify-between gap-3">
                    <span className="min-w-0 text-[#1F2A44]">{session.title}</span>
                    <span className="shrink-0 text-right text-[12px] text-[#52607A]">{formatClassTime(session.startsAt)}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className={card}>
            <h2 className={sectionTitle}>Instructors</h2>
            {instructors.length === 0 ? (
              <p className="text-[13px] text-[#52607A]">To be announced.</p>
            ) : (
              <ul className="flex flex-wrap gap-4">
                {instructors.map((person) => (
                  <li key={person.name} className="flex items-center gap-2.5">
                    <UserAvatar className="h-8 w-8" />
                    <b className="text-[13px] text-[#1F2A44]">{person.name}</b>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </article>
  );
};


export default ProgramLanding;
