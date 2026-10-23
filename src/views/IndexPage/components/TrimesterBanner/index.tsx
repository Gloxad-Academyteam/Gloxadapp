"use client";

import { useRouter } from "next/navigation";
import TrimesterUiux from "@assets/images/trimester-uiux.png";
import CourseUiuxBeginner from "@assets/images/course-uiux-beginner.png";
import CourseBrandDesign from "@assets/images/course-brand-design.png";
import CourseMotionDesign from "@assets/images/course-motion-design.png";

const trimesterCourses = [
  {
    title: "UI/UX Design",
    description: "Master the art of user experience and interface design. Learn Figma, wireframing, prototyping, and user research.",
    deadline: "Enrollment Closes: March 10, 2026",
    image: TrimesterUiux,
    to: "/courses?search=ui-ux-design",
  },
  {
    title: "Frontend Development",
    description: "Learn modern web interfaces using HTML, CSS, JavaScript, React, and responsive development practices.",
    deadline: "Enrollment Closes: March 24, 2026",
    image: CourseUiuxBeginner,
    to: "/courses?search=frontend-development",
  },
  {
    title: "Data Analysis",
    description: "Build practical analytics skills with spreadsheets, dashboards, visualization, and real-world reporting projects.",
    deadline: "Enrollment Closes: April 4, 2026",
    image: CourseBrandDesign,
    to: "/courses?search=data-analysis",
  },
  {
    title: "Product Marketing",
    description: "Learn positioning, campaign strategy, customer research, and performance-focused digital marketing.",
    deadline: "Enrollment Closes: April 18, 2026",
    image: CourseMotionDesign,
    to: "/courses?search=marketing",
  },
];

const TrimesterBanner = () => {
  const router = useRouter();
  // The trimester landing page explains the programmes; its "Start your trimester" button leads on to the LMS
  const target = "/trimester";

  return (
    <div className="relative flex min-h-[420px] w-full flex-col overflow-hidden rounded-[24px] md:rounded-[36px] bg-gradient-to-r from-[#0a1b56] to-[#80a4e3] shadow-sm px-6 pb-10 pt-14 lg:flex-row lg:px-14 lg:pb-14 lg:pt-16">
      <div className="flex w-full flex-col justify-center lg:w-[42%]">
        <h2 className="text-[26px] font-semibold leading-[1.2] text-white md:text-[34px] lg:text-[40px]">
          Upcoming
          <br />
          Trimester Courses
        </h2>
        <p className="mt-4 max-w-[400px] text-[14px] leading-[1.5] text-white/90 lg:mt-5 lg:text-[15px]">
          <span className="sm:hidden">Enroll before the deadline and learn with a cohort.</span>
          <span className="hidden sm:inline">Enroll in our structured trimester courses before the deadline. Stay ahead and learn with a cohort of motivated students.</span>
        </p>

        {/* ===================== MOBILE (below lg) — swipe hint + CTA ===================== */}
        <div className="mt-4 flex items-center gap-2 text-[13px] font-medium text-[#eaf2fd] lg:hidden animate-pulse">
          <span>Swipe to view courses</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* ===================== DESKTOP (lg and up) — CTA ===================== */}
        <button
          type="button"
          onClick={() => router.push(target)}
          className="mt-8 hidden h-[46px] w-[220px] rounded-full border border-white text-[14px] font-medium text-white transition hover:bg-white hover:text-[#07004d] lg:block"
        >
          View All Trimester Courses
        </button>
      </div>

      <div
        id="trimester-courses-container"
        className="mt-8 flex gap-6 overflow-x-auto pb-6 snap-x lg:mt-0 lg:w-[58%] relative [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden -mx-6 px-6 lg:mx-0 lg:px-0 lg:pl-10 after:content-[''] after:block after:w-6 after:shrink-0 lg:after:w-[100px]"
      >
        {trimesterCourses.map((course) => (
          <article
            key={course.title}
            onClick={() => router.push(target)}
            className="card-interactive flex w-[260px] lg:w-[300px] shrink-0 snap-center cursor-pointer flex-col rounded-[16px] bg-white p-5 shadow-xl"
          >
            <img src={course.image.src} alt={course.title} className="h-[160px] lg:h-[180px] w-full rounded-[12px] object-cover" />
            <h3 className="mt-4 text-[16px] lg:text-[17px] font-semibold text-[#202127]">{course.title}</h3>
            <p className="mt-2 line-clamp-2 text-[12px] lg:line-clamp-none lg:text-[13px] leading-[1.4] text-[#717480]">{course.description}</p>
            <p className="mt-3 text-[11px] lg:text-[12px] font-medium text-[#ff8800]">{course.deadline}</p>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                router.push(target);
              }}
              className="btn-interactive mt-4 h-[36px] lg:h-[40px] w-full rounded-full bg-[#0a1b56] text-[13px] lg:text-[14px] font-medium text-white transition hover:bg-[#07004d]"
            >
              Enroll Now
            </button>
          </article>
        ))}
      </div>

      {/* ===================== MOBILE (below lg) — view all button ===================== */}
      <button
        type="button"
        onClick={() => router.push(target)}
        className="mt-6 mx-auto h-[46px] rounded-full border border-white px-8 text-[14px] font-medium text-white transition hover:bg-white hover:text-[#07004d] lg:hidden"
      >
        View All Trimester Courses
      </button>
    </div>
  );
};

export default TrimesterBanner;
