"use client";

import { useRouter } from "next/navigation";
import CourseCard from "@components/CourseCard";
import ScrollReveal from "@components/ScrollReveal";
import { catalogCourses } from "@services/catalog";

// Four featured free courses from the catalog; the full list lives on /free
const FEATURED_SLUGS = ["python-programming", "graphics-design", "digital-marketing", "cybersecurity"];
const freeCourses = FEATURED_SLUGS.map((slug) => catalogCourses.find((course) => course.slug === slug)).filter(Boolean) as typeof catalogCourses;

const FreeCourses = () => {
  const router = useRouter();

  return (
    <ScrollReveal className="mx-auto flex w-full max-w-[1512px] flex-col items-center px-5 py-10 md:px-10 lg:px-[120px]">
      <div className="mb-8 text-center">
        <h2 className="text-[28px] font-bold leading-[1.2] text-[#202127] md:text-[34px]">
          Start Learning for Free!
        </h2>
        <p className="mt-2 text-[15px] text-[#4e515c]">
          Explore our free courses and upgrade anytime to get a certificate!
        </p>
        <button
          type="button"
          onClick={() => router.push("/free")}
          className="btn-interactive mt-5 h-[42px] rounded-full border border-[#07004d] px-6 text-[14px] font-medium text-[#07004d] transition hover:bg-[#07004d] hover:text-white"
        >
          Browse all {catalogCourses.length} free courses
        </button>
      </div>

      {/* ===================== MOBILE (below sm) — swipeable snap-scroll carousel ===================== */}
      {/* ===================== DESKTOP (sm and up) — static grid ===================== */}
      <div className="flex w-full max-w-[1272px] gap-4 overflow-x-auto pb-2 snap-x snap-mandatory -mx-5 px-5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3">
        {freeCourses.map((course) => (
          <div key={course.slug} className="w-[82vw] shrink-0 snap-center sm:w-auto sm:shrink sm:snap-none">
            <CourseCard
              href={`/courses/${course.slug}`}
              title={course.title}
              image={course.thumbnail}
              provider="Gloxad Academy"
              tag={course.programme}
              meta={[course.level, `${course.videos.length} video lessons`, `${course.videoHours} hours`]}
              priceLabel="Free"
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => router.push("/free")}
        className="mt-10 flex h-[46px] items-center justify-center rounded-full border border-[#181C7B] px-8 text-[14px] font-medium text-[#181C7B] transition hover:bg-gray-50"
      >
        View All Free Courses
      </button>
    </ScrollReveal>
  );
};

export default FreeCourses;
