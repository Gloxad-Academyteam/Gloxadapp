"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FiAward,
  FiBookOpen,
  FiBriefcase,
  FiCalendar,
  FiCheck,
  FiChevronDown,
  FiMonitor,
  FiUsers,
  FiVideo,
} from "react-icons/fi";
import useAuth from "@hooks/useAuth";
import { trimesterHref } from "@utils/trimesterHref";
import { catalogCourses } from "@services/catalog";

// Trimester programmes follow Gloxad Academy's Academic Progression Framework (v2.0, October 2026):
// Foundation → 3-month Certificate → 6-month Professional Certificate → Diploma + 3-month internship.

const naira = (amount: number) => `₦${amount.toLocaleString()}`;

const pathway = [
  {
    step: "Foundation",
    title: "Fundamental & Basic Computing",
    duration: "Duration to be finalised",
    fee: "₦50,000 – ₦70,000",
    detail: "Required before any Certificate. Secondary School track ₦50,000, Undergraduate track ₦70,000.",
  },
  {
    step: "Trimester 1",
    title: "Certificate",
    duration: "3 months",
    fee: naira(150000),
    detail: "Your first trimester in a specialisation. Requires Foundation completion.",
  },
  {
    step: "Trimesters 2–3",
    title: "Professional Certificate",
    duration: "6 months",
    fee: naira(300000),
    detail: "Builds on the matching Certificate, with an optional 3-month internship.",
  },
  {
    step: "Diploma",
    title: "Diploma + internship",
    duration: "6 months + 3-month internship",
    fee: naira(400000),
    detail: "Requires the matching Professional Certificate. Awarded after the compulsory internship.",
  },
];

const benefits = [
  { Icon: FiUsers, title: "Learn with a cohort", detail: "Start together each trimester and progress with classmates." },
  { Icon: FiVideo, title: "Live classes", detail: "Instructor-led sessions alongside self-paced video lessons." },
  { Icon: FiBookOpen, title: "Assignments and quizzes", detail: "Practical work reviewed through the Gloxad learning portal." },
  { Icon: FiMonitor, title: "Coding lab and community", detail: "Practise in the browser and get help from your cohort." },
  { Icon: FiAward, title: "Recognised certificates", detail: "Earn a Certificate, Professional Certificate and Diploma." },
  { Icon: FiBriefcase, title: "Industry internship", detail: "A compulsory 3-month internship completes the Diploma." },
];

const faqs = [
  {
    q: "What is a trimester?",
    a: "A trimester is a 3-month term. Each Certificate takes one trimester, a Professional Certificate takes two, and the Diploma stage takes two plus a 3-month internship.",
  },
  {
    q: "Do I need to complete the Foundation first?",
    a: "Yes. Fundamental & Basic Computing must be completed before you can join a 3-month Certificate Programme.",
  },
  {
    q: "How much does each stage cost?",
    a: "Foundation is ₦50,000 (Secondary School track) or ₦70,000 (Undergraduate track). The Certificate is ₦150,000, the Professional Certificate ₦300,000 and the Diploma ₦400,000.",
  },
  {
    q: "Is the internship required?",
    a: "The 3-month internship is optional after the Professional Certificate and compulsory for the Diploma, which is awarded once the internship is complete.",
  },
  {
    q: "Can I move to the next stage in a different specialisation?",
    a: "Each stage builds on the matching earlier stage, so the Professional Certificate requires the Certificate in the same specialisation, and the Diploma requires the matching Professional Certificate.",
  },
];

const TrimesterPage = () => {
  const { isAuthenticated } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const startHref = trimesterHref(isAuthenticated);
  const programmes = catalogCourses.filter((course) => course.type === "academic");

  return (
    <div className="w-full overflow-x-hidden bg-white font-sans">
      {/* ===================== HERO ===================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0d0a6b] via-[#07004d] to-[#040030] text-white">
        <div className="pointer-events-none absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full bg-[#3e92cc] opacity-20 blur-3xl" />
        <div className="relative mx-auto grid w-full max-w-[1512px] items-center gap-10 px-5 py-14 sm:px-8 md:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-20 xl:px-[120px]">
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#8fc3ea] sm:text-[13px]">Trimester Programmes</p>
            <h1 className="mt-3 font-['DM_Sans'] text-[30px] font-bold leading-[1.1] tracking-[-0.5px] sm:text-[40px] lg:text-[48px] lg:tracking-[-1.5px]">
              Learn in trimesters. Graduate with a Diploma.
            </h1>
            <p className="mt-4 max-w-[560px] text-[15px] leading-[1.6] text-white/85 sm:text-[16px]">
              Structured 3-month terms with live classes, a cohort and real projects. Start with a Certificate and
              progress to a Professional Certificate and a Diploma with an industry internship.
            </p>
            <div className="mt-7 flex flex-col gap-3 min-[420px]:flex-row">
              <Link
                href={startHref}
                className="btn-interactive flex h-[46px] items-center justify-center rounded-full bg-[#4aa3df] px-7 text-[14px] font-medium text-white transition-colors hover:bg-[#3e92cc]"
              >
                Start your trimester
              </Link>
              <a
                href="#programmes"
                className="flex h-[46px] items-center justify-center rounded-full border border-white px-7 text-[14px] font-medium text-white transition-colors hover:bg-white hover:text-[#07004d]"
              >
                View programmes
              </a>
            </div>
          </div>

          {/* At-a-glance card */}
          <dl className="grid grid-cols-2 gap-3 rounded-[20px] border border-white/15 bg-white/10 p-5 backdrop-blur-sm sm:gap-4 sm:p-6">
            {[
              { Icon: FiCalendar, label: "Trimester length", value: "3 months" },
              { Icon: FiBookOpen, label: "Specialisations", value: `${programmes.length} programmes` },
              { Icon: FiAward, label: "Certificate from", value: naira(150000) },
              { Icon: FiBriefcase, label: "Diploma", value: "+ 3-month internship" },
            ].map(({ Icon, label, value }) => (
              <div key={label} className="rounded-[14px] bg-white/10 p-4">
                <Icon className="text-[20px] text-[#8fc3ea]" />
                <dt className="mt-3 text-[12px] text-white/70 sm:text-[13px]">{label}</dt>
                <dd className="mt-0.5 text-[15px] font-bold sm:text-[17px]">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ===================== PATHWAY ===================== */}
      <section className="mx-auto w-full max-w-[1512px] px-5 py-14 sm:px-8 md:px-10 lg:px-8 lg:py-20 xl:px-[120px]">
        <div className="max-w-[720px]">
          <h2 className="text-[26px] font-bold leading-tight text-[#202127] md:text-[34px]">Your path, one trimester at a time</h2>
          <p className="mt-3 text-[15px] leading-[1.6] text-[#4e515c]">
            Every specialisation follows the same progression. Each stage unlocks the next one in the same programme.
          </p>
        </div>

        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {pathway.map((stage, index) => (
            <li key={stage.step} className="relative flex flex-col rounded-[16px] border border-[#e2e4ed] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#07004d] text-[14px] font-bold text-white">
                  {index + 1}
                </span>
                <span className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#3e92cc]">{stage.step}</span>
              </div>
              <h3 className="mt-4 text-[18px] font-bold text-[#202127]">{stage.title}</h3>
              <p className="mt-1 text-[13px] text-[#717480]">{stage.duration}</p>
              <p className="mt-3 text-[14px] leading-[1.55] text-[#4e515c]">{stage.detail}</p>
              <p className="mt-auto pt-4 text-[20px] font-bold text-[#07004d]">{stage.fee}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ===================== PROGRAMMES ===================== */}
      <section id="programmes" className="scroll-mt-[140px] bg-[#f5f7fb]">
        <div className="mx-auto w-full max-w-[1512px] px-5 py-14 sm:px-8 md:px-10 lg:px-8 lg:py-20 xl:px-[120px]">
          <div className="max-w-[720px]">
            <h2 className="text-[26px] font-bold leading-tight text-[#202127] md:text-[34px]">Choose your specialisation</h2>
            <p className="mt-3 text-[15px] leading-[1.6] text-[#4e515c]">
              {programmes.length} programmes, each running from Certificate to Diploma.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {programmes.map((course) => (
              <Link
                key={course.slug}
                href={`/courses/${course.slug}`}
                className="card-interactive group flex flex-col overflow-hidden rounded-[14px] border border-[#e2e4ed] bg-white"
              >
                <div className="overflow-hidden bg-[#eaf2fd]">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    loading="lazy"
                    className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="text-[16px] font-bold leading-tight text-[#202127]">{course.title}</h3>
                  <p className="mt-2 line-clamp-3 text-[13px] leading-[1.5] text-[#6b6d76]">{course.description}</p>
                  <p className="mt-auto pt-4 text-[13px] font-bold text-[#07004d]">From {naira(150000)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== BENEFITS ===================== */}
      <section className="mx-auto w-full max-w-[1512px] px-5 py-14 sm:px-8 md:px-10 lg:px-8 lg:py-20 xl:px-[120px]">
        <h2 className="max-w-[720px] text-[26px] font-bold leading-tight text-[#202127] md:text-[34px]">What every trimester includes</h2>
        <div className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map(({ Icon, title, detail }) => (
            <div key={title} className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-[#eaf2fd] text-[20px] text-[#07004d]">
                <Icon />
              </span>
              <div>
                <h3 className="text-[16px] font-bold text-[#202127]">{title}</h3>
                <p className="mt-1 text-[14px] leading-[1.55] text-[#4e515c]">{detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== FAQ ===================== */}
      <section className="mx-auto w-full max-w-[1512px] px-5 pb-14 sm:px-8 md:px-10 lg:px-8 lg:pb-20 xl:px-[120px]">
        <h2 className="text-[26px] font-bold leading-tight text-[#202127] md:text-[34px]">Frequently asked questions</h2>
        <div className="mt-8 max-w-[860px] divide-y divide-[#e2e4ed] border-y border-[#e2e4ed]">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div key={faq.q}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                >
                  <span className="text-[15px] font-bold text-[#202127] md:text-[16px]">{faq.q}</span>
                  <FiChevronDown className={`shrink-0 text-[18px] text-[#07004d] transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && <p className="pb-5 pr-8 text-[14px] leading-[1.65] text-[#4e515c]">{faq.a}</p>}
              </div>
            );
          })}
        </div>
      </section>

      {/* ===================== CTA ===================== */}
      <section className="mx-auto w-full max-w-[1512px] px-5 pb-16 sm:px-8 md:px-10 lg:px-8 lg:pb-24 xl:px-[120px]">
        <div className="flex flex-col items-start gap-6 rounded-[24px] bg-[#07004d] px-6 py-10 text-white sm:px-10 md:flex-row md:items-center md:justify-between">
          <div className="max-w-[600px]">
            <h2 className="text-[24px] font-bold leading-tight md:text-[30px]">Ready to start your first trimester?</h2>
            <ul className="mt-4 flex flex-col gap-2 text-[14px] text-white/85">
              {["Complete the Foundation", "Join a Certificate cohort", "Progress to your Diploma"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <FiCheck className="shrink-0 text-[#8fc3ea]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <Link
            href={startHref}
            className="btn-interactive flex h-[48px] shrink-0 items-center justify-center rounded-full bg-[#4aa3df] px-8 text-[15px] font-medium text-white transition-colors hover:bg-[#3e92cc]"
          >
            Start your trimester
          </Link>
        </div>
      </section>
    </div>
  );
};

export default TrimesterPage;
