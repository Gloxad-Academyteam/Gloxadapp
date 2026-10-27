"use client";

import { useRouter } from "next/navigation";
import ScrollReveal from "@components/ScrollReveal";
import { catalogCourses } from "@services/catalog";

// Four featured free courses from the catalog; the full list lives on /free
const FEATURED_SLUGS = ["python-programming", "graphics-design", "digital-marketing", "cybersecurity"];
const freeCourses = FEATURED_SLUGS.map((slug) => catalogCourses.find((course) => course.slug === slug)).filter(Boolean) as typeof catalogCourses;

const FreeCourses = () => {
  const router = useRouter();

  return (
    <ScrollReveal className="mx-auto flex w-full max-w-[1512px] flex-col items-center px-5 py-10 md:px-10 lg:px-[120px]">
      <div className="text-center">
        <h2 className="text-[28px] font-bold leading-[1.2] text-[#202127] md:text-[34px]">
          Start Learning for Free!
        </h2>
        <p className="mt-2 text-[15px] text-[#4e515c] mb-8">
          Explore our free courses and upgrade anytime to get a certificate!
        </p>
        <button
          type="button"
          onClick={() => router.push("/free")}
          className="btn-interactive mt-4 h-[42px] rounded-full border border-[#07004d] px-6 text-[14px] font-medium text-[#07004d] transition hover:bg-[#07004d] hover:text-white"
        >
          Browse all {catalogCourses.length} free courses
        </button>
      </div>

      {/* ===================== MOBILE (below sm) — swipeable snap-scroll carousel ===================== */}
      {/* ===================== DESKTOP (sm and up) — static grid ===================== */}
      <div className="flex w-full max-w-[1272px] gap-4 overflow-x-auto pb-2 snap-x snap-mandatory -mx-5 px-5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-[20px] sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4">
        {freeCourses.map((course) => (
          <article
            key={course.slug}
            onClick={() => router.push(`/courses/${course.slug}`)}
            className="card-interactive flex w-[75vw] shrink-0 snap-center cursor-pointer flex-col overflow-hidden rounded-[12px] border border-[#dedee7] bg-white sm:w-auto sm:shrink sm:snap-none"
          >
            <div className="p-3">
              <img src={course.thumbnail} alt={course.title} loading="lazy" className="h-[160px] w-full rounded-[8px] object-cover" />
            </div>
            <div className="flex flex-1 flex-col p-5 pt-2">
              <h3 className="text-[16px] font-bold leading-[1.3] text-[#202127]">{course.title}</h3>
              <p className="mt-2 text-[13px] leading-[1.5] text-[#717480] line-clamp-2">{course.subtitle}</p>
              <p className="mt-3 text-[13px] text-[#717480]">{course.videos.length} video lessons · {course.videoHours} hours</p>
              <p className="mt-1 text-[13px] text-[#717480]">{course.level}</p>
              <div className="mt-auto pt-5">
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    router.push(`/courses/${course.slug}`);
                  }}
                  className="btn-interactive h-[40px] w-[140px] rounded-full bg-[#181C7B] text-[13px] font-medium text-white transition hover:bg-[#111456]"
                >
                  Start Learning
                </button>
              </div>
            </div>
          </article>
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
