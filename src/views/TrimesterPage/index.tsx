"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLenis } from "@studio-freight/react-lenis";
import { FiCheck, FiCalendar, FiLayers, FiBarChart2, FiUsers } from "react-icons/fi";
import useAuth from "@hooks/useAuth";
import { trimesterCourses } from "./data";

const TABS = ["Overview", "Modules", "Who it's for", "Instructors"] as const;
type Tab = (typeof TABS)[number];

const TrimesterPage = () => {
  const router = useRouter();
  const lenis = useLenis();
  const { isAuthenticated } = useAuth();
  const [activeSlug, setActiveSlug] = useState(trimesterCourses[0].slug);
  const [tab, setTab] = useState<Tab>("Overview");

  const course = trimesterCourses.find((c) => c.slug === activeSlug) ?? trimesterCourses[0];
  const others = trimesterCourses.filter((c) => c.slug !== course.slug);

  const enroll = () => router.push(isAuthenticated ? "/dashboard?tab=trimester" : "/auth/signin?redirect=/trimester");

  const selectCourse = (slug: string) => {
    setActiveSlug(slug);
    setTab("Overview");
    const top = document.getElementById("trimester-top");
    if (top) lenis?.scrollTo(top, { offset: -140 });
  };

  const stats = [
    { Icon: FiLayers, label: `${course.modules.length} Modules`, detail: course.duration },
    { Icon: FiCalendar, label: "Enrollment closes", detail: course.closes },
    { Icon: FiBarChart2, label: "Level", detail: course.level },
    { Icon: FiUsers, label: "Format", detail: course.format },
  ];

  return (
    <div className="w-full bg-white font-sans">
      <main className="relative mx-auto w-full max-w-[1512px] overflow-hidden px-5 pb-16 pt-8 md:px-10 lg:px-8 lg:pb-24 lg:pt-12 xl:px-[120px]">
        {/* Soft blue wash from the Figma background */}
        <div className="pointer-events-none absolute -right-40 top-40 h-[520px] w-[520px] rounded-full bg-[#eaf2fd] opacity-80 blur-3xl" />

        {/* ===================== HERO: title + featured course ===================== */}
        <section id="trimester-top" className="relative grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          {/* ---- MOBILE (below lg): image first ---- */}
          <div className="order-1 lg:order-2">
            <div className="relative mx-auto aspect-[4/3] w-full max-w-[520px] overflow-hidden rounded-[24px] bg-[#eaf2fd] shadow-sm lg:max-w-none">
              <img key={course.slug} src={course.image.src} alt={course.title} className="h-full w-full object-cover" />
            </div>
          </div>

          {/* ---- DESKTOP (lg and up): text left ---- */}
          <div className="order-2 lg:order-1">
            <h1 className="text-[28px] font-bold text-[#202127] md:text-[34px] lg:text-[40px]">Trimester Courses</h1>
            <img src="/gloxadlogo.png" alt="Gloxad Academy" className="mt-5 h-8 w-[96px] object-contain object-left" />
            <h2 className="mt-5 text-[22px] font-bold leading-tight text-[#202127] md:text-[26px]">{course.title}</h2>
            <p className="mt-3 max-w-[560px] text-[14px] leading-[1.6] text-[#4e515c] md:text-[15px]">{course.summary}</p>
            <p className="mt-4 flex items-center gap-3 text-[13px] text-[#717480]">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#07004d] text-[11px] font-bold text-white">G</span>
              Taught by Gloxad Academy instructors
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={enroll}
                className="btn-interactive h-[42px] rounded-full bg-[#07004d] px-8 text-[14px] font-medium text-white transition hover:bg-[#111456]"
              >
                Enroll now
              </button>
              <span className="text-[13px] font-medium text-[#ff8800]">Enrollment closes: {course.closes}</span>
            </div>
          </div>
        </section>

        {/* ===================== STATS CARD ===================== */}
        <section className="relative mt-10 rounded-[16px] border border-[#efeff5] bg-white p-5 shadow-sm md:p-6 lg:mt-14">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-5 lg:grid-cols-4 lg:gap-x-8">
            {stats.map(({ Icon, label, detail }) => (
              <div key={label} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eaf2fd] text-[16px] text-[#07004d]">
                  <Icon />
                </span>
                <div className="min-w-0">
                  <dt className="text-[14px] font-bold text-[#202127]">{label}</dt>
                  <dd className="mt-0.5 text-[12px] leading-snug text-[#717480] md:text-[13px]">{detail}</dd>
                </div>
              </div>
            ))}
          </dl>
        </section>

        {/* ===================== TABS ===================== */}
        <section className="relative mt-8 lg:mt-10">
          <div
            role="tablist"
            className="-mx-5 flex gap-2 overflow-x-auto border-b border-[#efeff5] px-5 md:mx-0 md:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {TABS.map((name) => (
              <button
                key={name}
                role="tab"
                type="button"
                aria-selected={tab === name}
                onClick={() => setTab(name)}
                className={`relative shrink-0 whitespace-nowrap px-4 py-3 text-[14px] font-medium transition-colors ${
                  tab === name ? "text-[#07004d]" : "text-[#717480] hover:text-[#202127]"
                }`}
              >
                {name}
                <span
                  className={`absolute inset-x-3 -bottom-px h-[3px] rounded-full bg-[#07004d] transition-opacity ${
                    tab === name ? "opacity-100" : "opacity-0"
                  }`}
                />
              </button>
            ))}
          </div>

          <div role="tabpanel" className="pt-8">
            {tab === "Overview" && (
              <div className="flex flex-col gap-10">
                <ul className="grid gap-x-12 gap-y-4 md:grid-cols-2">
                  {course.outcomes.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[14px] leading-[1.6] text-[#4e515c]">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#eaf2fd] text-[12px] text-[#07004d]">
                        <FiCheck />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>

                <div>
                  <h3 className="text-[18px] font-bold text-[#202127]">What you&apos;ll learn in this course</h3>
                  <p className="mt-3 max-w-[820px] text-[14px] leading-[1.7] text-[#4e515c]">{course.about}</p>
                </div>

                <div>
                  <h3 className="text-[18px] font-bold text-[#202127]">Skills you&apos;ll gain</h3>
                  <div className="mt-4 flex flex-wrap gap-2.5">
                    {course.skills.map((skill) => (
                      <span key={skill} className="rounded-[8px] bg-[#eef0f6] px-4 py-2 text-[13px] font-medium text-[#3a3d4a]">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {tab === "Modules" && (
              <ol className="flex max-w-[820px] flex-col gap-3">
                {course.modules.map((module, index) => (
                  <li key={module.title} className="flex items-start gap-4 rounded-[12px] border border-[#efeff5] bg-white p-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#07004d] text-[13px] font-bold text-white">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-[15px] font-bold text-[#202127]">{module.title}</p>
                      <p className="mt-0.5 text-[13px] text-[#717480]">{module.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
            )}

            {tab === "Who it's for" && (
              <ul className="flex max-w-[820px] flex-col gap-4">
                {course.audience.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[14px] leading-[1.6] text-[#4e515c]">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#eaf2fd] text-[12px] text-[#07004d]">
                      <FiCheck />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            )}

            {tab === "Instructors" && (
              <div className="flex max-w-[820px] items-center gap-4 rounded-[12px] border border-[#efeff5] p-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#07004d] text-[16px] font-bold text-white">G</span>
                <div>
                  <p className="text-[15px] font-bold text-[#202127]">Gloxad Academy instructors</p>
                  <p className="mt-0.5 text-[13px] text-[#717480]">
                    Industry practitioners who lead live sessions, review your work and mentor your cohort.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ===================== OTHER TRIMESTER COURSES ===================== */}
        <section className="relative mt-14 lg:mt-20">
          <h2 className="text-[22px] font-bold text-[#202127] md:text-[26px]">More upcoming trimester courses</h2>
          <p className="mt-2 text-[14px] text-[#4e515c]">Enroll before the deadline and learn with a cohort of motivated students.</p>

          {/* MOBILE: swipe carousel — DESKTOP: 3-column grid */}
          <div className="-mx-5 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 lg:grid-cols-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {others.map((item) => (
              <article
                key={item.slug}
                className="card-interactive flex w-[78vw] shrink-0 snap-center flex-col overflow-hidden rounded-[16px] border border-[#efeff5] bg-white sm:w-auto"
              >
                <img src={item.image.src} alt={item.title} className="h-[170px] w-full object-cover" />
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-[17px] font-bold text-[#202127]">{item.title}</h3>
                  <p className="mt-2 line-clamp-3 text-[13px] leading-[1.5] text-[#6b6d76]">{item.summary}</p>
                  <p className="mt-3 text-[12px] font-medium text-[#ff8800]">Enrollment closes: {item.closes}</p>
                  <p className="mt-1 text-[12px] text-[#8a8c95]">
                    {item.duration} · {item.level}
                  </p>
                  <div className="mt-auto flex gap-2 pt-5">
                    <button
                      type="button"
                      onClick={() => selectCourse(item.slug)}
                      className="h-[38px] flex-1 rounded-full border border-[#07004d] text-[13px] font-medium text-[#07004d] transition hover:bg-[#07004d] hover:text-white"
                    >
                      View details
                    </button>
                    <button
                      type="button"
                      onClick={enroll}
                      className="btn-interactive h-[38px] flex-1 rounded-full bg-[#07004d] text-[13px] font-medium text-white transition hover:bg-[#111456]"
                    >
                      Enroll now
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default TrimesterPage;
