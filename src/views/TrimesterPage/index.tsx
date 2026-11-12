"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import CourseCard, { COURSE_GRID } from "@components/CourseCard";
import ComingSoon from "@components/ComingSoon";
import { CourseGridSkeleton } from "@components/CourseCard/Skeleton";
import { ErrorState, formatDay } from "@components/Landing";
import { lmsPublicApi, type TPublicTrimester } from "@services/lmsPublic";

const PHOTOS = "/images/trimester/photos";

const feeLabel = (trimester: TPublicTrimester) =>
  trimester.price > 0 ? new Intl.NumberFormat("en-NG", { style: "currency", currency: trimester.currency, maximumFractionDigits: 0 }).format(trimester.price) : "Free";

const stateLabel = (trimester: TPublicTrimester) =>
  trimester.enrolled ? "You are enrolled" : trimester.enrolmentState === "open" ? "Enrolment open" : trimester.enrolmentState === "upcoming" ? "Opens soon" : "Enrolment closed";

// The five day rhythm every week of a course follows
const RHYTHM = [
  { day: "Monday", label: "Learning", text: "Watch the lessons and read the notes for the week." },
  { day: "Tuesday", label: "Practice", text: "Code along in the sandbox and check your understanding with a quiz." },
  { day: "Wednesday", label: "Instructor session", text: "Join your tutor and cohort in a live class. Ask questions, vote in polls, chat.", live: true },
  { day: "Thursday", label: "Applied learning", text: "Use what you learned on a hands-on task or assignment." },
  { day: "Friday", label: "Assessment", text: "Show what you know, get feedback and see where to improve." },
];

const STEPS = [
  { title: "Choose a course", text: "Pick the Trimester course that fits your goal. Each one has its own weeks, tutor and schedule." },
  { title: "Enrol or apply for a scholarship", text: "Sign in as a student and enrol while the window is open. If you need support, apply for a scholarship first." },
  { title: "Learn with your cohort", text: "Follow the weekly rhythm, join live classes, submit work and get feedback from your tutor." },
  { title: "Finish and get certified", text: "Complete your final project, pass the course and receive a certificate anyone can verify online." },
];

// Default weights. A cohort can adjust them, so the page says so.
const WEIGHTS = [
  { label: "Final project", weight: 25 },
  { label: "Quizzes", weight: 15 },
  { label: "Assignments", weight: 15 },
  { label: "Practical labs", weight: 15 },
  { label: "Coding challenges", weight: 10 },
  { label: "Live class attendance", weight: 10 },
  { label: "Weekly tasks", weight: 10 },
];

const CERTIFICATE_RULES = [
  "Finish the learning activities in your course",
  "Reach an overall score of at least 70%",
  "Attend at least 70% of live classes",
  "Have your final project reviewed by your tutor and approved by an administrator",
];

const FAQ = [
  { q: "Who can join?", a: "Anyone with a student account. Sign in or create one, then enrol in an open course. Tutors and administrators cannot enrol as students." },
  { q: "What does it cost?", a: "The fee is shown on each course. Many are free. If a course is paid, you will see the price before you enrol. If you need help with fees, apply for a scholarship." },
  { q: "When can I enrol?", a: "Each Trimester has an enrolment window. The page shows when it opens and closes, and whether seats are left. When the window closes or the seats are gone, the button tells you." },
  { q: "How do live classes work?", a: "Live classes run in your browser. The Join button switches on 10 minutes before the class starts. Your attendance is recorded automatically from when you join and leave." },
  { q: "What if I miss a class?", a: "Attendance counts toward your result, so tell your tutor and keep up with the lessons and the work for that week. Your tutor can mark an excused absence." },
  { q: "Can I withdraw?", a: "Yes, while your enrolment is active. Your progress is kept. If the enrolment window is still open you can enrol again." },
  { q: "How do I get my certificate?", a: "When you meet the requirements above, an administrator issues it. Each certificate has a QR code and a public page where employers can check it is genuine." },
];

const Eyebrow = ({ children }: { children: React.ReactNode }) => <p className="mb-2 text-[12px] font-bold uppercase tracking-[0.12em] text-[#1D4ED8]">{children}</p>;
const SectionTitle = ({ children }: { children: React.ReactNode }) => <h2 className="text-[24px] font-bold leading-[1.25] text-[#0B1F4D] md:text-[30px]">{children}</h2>;

const TrimesterPage = () => {
  const trimesters = useQuery({ queryKey: ["lms.public.trimesters"], queryFn: lmsPublicApi.trimesters });
  const programs = trimesters.data ?? [];

  // The next intake a visitor can still join: the earliest start among courses that are not closed
  const open = programs.filter((item) => item.enrolmentState !== "closed");
  const next = [...(open.length ? open : programs)].sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())[0];
  const weeks = next?.weeks ?? 12;

  return (
    <div className="w-full bg-[#F3F6FB]">
      <main className="mx-auto w-full max-w-[1240px] px-4 pb-20 pt-6 sm:px-6 md:pt-8">
        {/* Hero */}
        <header className="relative overflow-hidden rounded-[24px] bg-[linear-gradient(120deg,#0B1F4D_0%,#1E4FC9_140%)] px-6 py-10 text-white sm:px-10 md:py-14">
          <span aria-hidden className="absolute -right-20 -top-20 h-[300px] w-[300px] rounded-full bg-white/[0.07]" />
          <img src={`${PHOTOS}/cover-default.webp`} alt="" className="absolute bottom-6 right-6 top-6 hidden w-[38%] rounded-[18px] object-cover shadow-[0_18px_40px_rgba(0,0,0,0.35)] lg:block" />
          <div className="relative lg:max-w-[56%]">
            <img src={`${PHOTOS}/cover-default.webp`} alt="" className="mb-5 block h-[170px] w-full rounded-[14px] object-cover lg:hidden" />
            <p className="mb-3 inline-block rounded-full bg-white/15 px-3 py-1 text-[12px] font-bold tracking-wide">GLOXAD TRIMESTER PROGRAM</p>
            <h1 className="text-[30px] font-bold leading-[1.15] sm:text-[42px]">Learn with a cohort. Finish with a certificate.</h1>
            <p className="mt-4 max-w-[600px] text-[16px] leading-[1.65] text-[#C9D5F0]">
              A {weeks}-week guided programme with live classes every week, real tutors, hands-on work, a final project and a certificate that employers can verify.
            </p>
            {next && (
              <p className="mt-4 text-[14px] text-[#DCE6FF]">
                Next intake starts <b>{formatDay(next.startsAt)}</b>
                {next.enrollmentClosesAt && next.enrolmentState === "open" ? <> · enrol by <b>{formatDay(next.enrollmentClosesAt)}</b></> : null}
              </p>
            )}
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#courses" className="inline-flex h-[50px] items-center rounded-full bg-white px-8 text-[15px] font-bold text-[#0B1F4D] transition hover:bg-[#eef2ff]">See the courses</a>
              <Link href="/scholarships" className="inline-flex h-[50px] items-center rounded-full bg-white/[0.18] px-8 text-[15px] font-bold text-white transition hover:bg-white/25">Apply for a scholarship</Link>
            </div>
          </div>
        </header>

        {/* At a glance */}
        <ul className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            [`${weeks} weeks`, "of guided learning"],
            ["Live class", "every week with your tutor"],
            ["Small cohorts", "so you are not just a number"],
            ["Certificate", "with a public verification page"],
          ].map(([title, text]) => (
            <li key={title} className="rounded-[16px] border border-[#DCE5F7] bg-white p-4 shadow-[0_6px_22px_rgba(11,31,77,0.06)]">
              <b className="block text-[18px] text-[#0B1F4D]">{title}</b>
              <span className="text-[13px] text-[#52607A]">{text}</span>
            </li>
          ))}
        </ul>

        {/* Courses */}
        <section id="courses" className="scroll-mt-24 pt-14">
          <Eyebrow>Courses</Eyebrow>
          <SectionTitle>Choose your Trimester course</SectionTitle>
          <p className="mb-6 mt-2 max-w-[640px] text-[15px] leading-[1.65] text-[#52607A]">Each course shows its weeks, live class schedule, tutor and how to enrol.</p>
          {trimesters.isLoading ? (
            <CourseGridSkeleton count={3} />
          ) : trimesters.isError ? (
            <ErrorState onRetry={() => trimesters.refetch()} />
          ) : programs.length === 0 ? (
            <div className="grid items-center gap-6 rounded-[20px] border border-dashed border-[#c9d3ee] bg-white p-6 md:grid-cols-[240px_1fr]">
              <img src={`${PHOTOS}/week-2.webp`} alt="" className="h-[170px] w-full rounded-[14px] object-cover" />
              <div>
                <h3 className="text-[18px] font-bold text-[#0B1F4D]">The next intake is being prepared</h3>
                <p className="mt-1.5 text-[14px] leading-[1.6] text-[#52607A]">No Trimester course is open yet. While you wait, every Gloxad free course is self-paced and ready to start, and you can apply for a scholarship now.</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link href="/free" className="inline-flex h-[44px] items-center rounded-full bg-[#0B1F4D] px-6 text-[14px] font-bold text-white">Browse free courses</Link>
                  <Link href="/scholarships" className="inline-flex h-[44px] items-center rounded-full border border-[#c9d3ee] px-6 text-[14px] font-bold text-[#0B1F4D]">See scholarships</Link>
                </div>
              </div>
            </div>
          ) : (
            <div className={COURSE_GRID}>
              {programs.map((program) => (
                <CourseCard
                  key={program.id}
                  href={`/trimester/${program.id}`}
                  title={program.programName}
                  image={program.thumbnail || `${PHOTOS}/card-default.webp`}
                  provider="Gloxad Academy"
                  tag="Trimester course"
                  meta={[`${program.weeks ?? 12} weeks`, `Starts ${formatDay(program.startsAt)}`, stateLabel(program)]}
                  priceLabel={feeLabel(program)}
                />
              ))}
              <ComingSoon title="More courses coming soon" text="New Trimester courses will be listed here as they are published." />
            </div>
          )}
        </section>

        {/* How it works */}
        <section className="pt-16">
          <Eyebrow>How it works</Eyebrow>
          <SectionTitle>From sign-up to certificate in four steps</SectionTitle>
          <ol className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, index) => (
              <li key={step.title} className="rounded-[18px] border border-[#DCE5F7] bg-white p-5 shadow-[0_6px_22px_rgba(11,31,77,0.06)]">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0B1F4D] text-[14px] font-bold text-white">{index + 1}</span>
                <h3 className="mt-3 text-[16px] font-bold text-[#0B1F4D]">{step.title}</h3>
                <p className="mt-1.5 text-[13.5px] leading-[1.6] text-[#52607A]">{step.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* A week */}
        <section className="pt-16">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            <div>
              <Eyebrow>Every week</Eyebrow>
              <SectionTitle>The same five-day rhythm</SectionTitle>
              <p className="mb-5 mt-2 text-[15px] leading-[1.65] text-[#52607A]">Only the content changes from week to week, so you always know what to do next.</p>
              <ol className="flex flex-col gap-2.5">
                {RHYTHM.map((item) => (
                  <li key={item.day} className="flex gap-4 rounded-[14px] border border-[#DCE5F7] bg-white p-4">
                    <span className={`mt-0.5 h-fit shrink-0 rounded-full px-3 py-1 text-[11.5px] font-bold text-white ${item.live ? "bg-[#FF5A5F]" : "bg-[#0B1F4D]"}`}>{item.day}</span>
                    <div>
                      <b className="text-[14.5px] text-[#0B1F4D]">{item.label}</b>
                      <p className="mt-0.5 text-[13.5px] leading-[1.55] text-[#52607A]">{item.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div className="grid gap-3">
              <img src={`${PHOTOS}/live-class.webp`} alt="" loading="lazy" className="h-[240px] w-full rounded-[20px] object-cover" />
              <img src={`${PHOTOS}/learn-anywhere.webp`} alt="" loading="lazy" className="h-[180px] w-full rounded-[20px] object-cover" />
            </div>
          </div>
        </section>

        {/* Assessment and certificate */}
        <section className="pt-16">
          <Eyebrow>Results</Eyebrow>
          <SectionTitle>How you are assessed, and how you earn your certificate</SectionTitle>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="rounded-[20px] border border-[#DCE5F7] bg-white p-6">
              <h3 className="text-[16px] font-bold text-[#0B1F4D]">What counts toward your score</h3>
              <ul className="mt-4 flex flex-col gap-3">
                {WEIGHTS.map((item) => (
                  <li key={item.label}>
                    <div className="mb-1 flex justify-between text-[13px]"><span className="text-[#1F2A44]">{item.label}</span><b className="text-[#0B1F4D]">{item.weight}%</b></div>
                    <div className="h-2 rounded-full bg-[#E7EDFB]"><div className="h-2 rounded-full bg-[#1E4FC9]" style={{ width: `${item.weight * 4}%` }} /></div>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-[12.5px] text-[#52607A]">These are the default weights. Your cohort&apos;s page shows the weights that apply to you.</p>
            </div>
            <div className="rounded-[20px] border border-[#DCE5F7] bg-white p-6">
              <h3 className="text-[16px] font-bold text-[#0B1F4D]">To earn your certificate you need to</h3>
              <ul className="mt-4 flex flex-col gap-3">
                {CERTIFICATE_RULES.map((rule) => (
                  <li key={rule} className="flex items-start gap-3 text-[14px] leading-[1.55] text-[#1F2A44]">
                    <span aria-hidden className="mt-[6px] h-2 w-2 shrink-0 rounded-full bg-[#0B6B45]" />
                    {rule}
                  </li>
                ))}
              </ul>
              <div className="mt-5 rounded-[14px] bg-[#F3F6FB] p-4 text-[13.5px] leading-[1.6] text-[#37456b]">
                Your final project goes through eight reviewed stages with your tutor. Your certificate has a QR code and a public page where anyone can confirm it is genuine.
              </div>
            </div>
          </div>
        </section>

        {/* Support and community */}
        <section className="pt-16">
          <Eyebrow>You are not learning alone</Eyebrow>
          <SectionTitle>Tutors, a cohort and support when you need it</SectionTitle>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              ["Real tutors", "Your tutor runs the live classes, reviews your work with a rubric and gives written feedback."],
              ["A cohort community", "Discuss lessons, share ideas and help each other in your cohort's channels."],
              ["Early support", "If your progress, attendance or deadlines slip, your tutor sees it early and can step in."],
            ].map(([title, text]) => (
              <div key={title} className="rounded-[18px] border border-[#DCE5F7] bg-white p-5">
                <h3 className="text-[16px] font-bold text-[#0B1F4D]">{title}</h3>
                <p className="mt-1.5 text-[13.5px] leading-[1.6] text-[#52607A]">{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Scholarships */}
        <section className="pt-16">
          <div className="grid overflow-hidden rounded-[24px] bg-[#0B1F4D] text-white md:grid-cols-[1fr_1.1fr]">
            <img src={`${PHOTOS}/week-1.webp`} alt="" loading="lazy" className="h-[220px] w-full object-cover md:h-full" />
            <div className="p-7 md:p-10">
              <p className="mb-2 text-[12px] font-bold uppercase tracking-[0.12em] text-[#9db8ff]">Scholarships</p>
              <h2 className="text-[24px] font-bold leading-[1.25] md:text-[30px]">Money should not stop you from learning</h2>
              <p className="mt-3 text-[15px] leading-[1.65] text-[#C9D5F0]">Apply for a scholarship to get free access to a Trimester course. Applications are reviewed by people, and you can follow the status of yours at any time.</p>
              <Link href="/scholarships" className="mt-6 inline-flex h-[48px] items-center rounded-full bg-white px-7 text-[14.5px] font-bold text-[#0B1F4D] transition hover:bg-[#eef2ff]">See open scholarships</Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="pt-16">
          <Eyebrow>Questions</Eyebrow>
          <SectionTitle>Things people ask before they enrol</SectionTitle>
          <div className="mt-6 flex flex-col gap-2.5">
            {FAQ.map((item) => (
              <details key={item.q} className="group rounded-[14px] border border-[#DCE5F7] bg-white px-5 py-4 open:shadow-[0_6px_22px_rgba(11,31,77,0.06)]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-bold text-[#0B1F4D]">
                  {item.q}
                  <span aria-hidden className="text-[20px] leading-none text-[#1E4FC9] transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-[14px] leading-[1.65] text-[#52607A]">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Closing call to action */}
        <section className="pt-16">
          <div className="rounded-[24px] bg-[linear-gradient(120deg,#0B1F4D_0%,#1E4FC9_140%)] px-6 py-10 text-center text-white md:py-12">
            <h2 className="text-[26px] font-bold leading-[1.2] md:text-[32px]">Ready to start?</h2>
            <p className="mx-auto mt-3 max-w-[520px] text-[15px] leading-[1.65] text-[#C9D5F0]">Pick a course, check the dates and enrol. It takes a few minutes.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a href="#courses" className="inline-flex h-[50px] items-center rounded-full bg-white px-8 text-[15px] font-bold text-[#0B1F4D]">See the courses</a>
              <Link href="/scholarships" className="inline-flex h-[50px] items-center rounded-full bg-white/[0.18] px-8 text-[15px] font-bold text-white">Apply for a scholarship</Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default TrimesterPage;
