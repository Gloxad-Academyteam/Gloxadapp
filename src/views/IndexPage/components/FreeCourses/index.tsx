"use client";

import { useRef } from "react";
import Link from "next/link";
import CourseCard from "@components/CourseCard";
import ScrollReveal from "@components/ScrollReveal";
import { CATALOG_CATEGORIES, categorySlug, youtubeFreeCatalogCourses } from "@services/catalog";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const FEATURED_GROUPS = [
  {
    category: "Software Development",
    description: "Build practical skills and create real applications.",
  },
  {
    category: "Data Science & Analytics",
    description: "Learn to work with data, insight and analytics tools.",
  },
  {
    category: "Artificial Intelligence",
    description: "Explore AI concepts and the tools behind them.",
  },
  {
    category: "Design",
    description: "Develop visual and product design skills.",
  },
];

const FreeCourses = () => {
  const rows = useRef<Record<string, HTMLDivElement | null>>({});
  const groups = FEATURED_GROUPS.map((group) => ({
    ...group,
    courses: youtubeFreeCatalogCourses
      .filter((course) => CATALOG_CATEGORIES.includes(group.category as (typeof CATALOG_CATEGORIES)[number]) && course.category === group.category)
      .slice(0, 6),
  })).filter((group) => group.courses.length > 0);

  const scrollRow = (category: string, direction: -1 | 1) => {
    rows.current[category]?.scrollBy({ left: direction * rows.current[category]!.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <ScrollReveal className="mx-auto w-full max-w-[1272px] px-5 py-12 md:px-10 md:py-16 lg:px-0">
      <header className="mb-9 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-[620px]">
          <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#4b4ca5]">Gloxad Academy</p>
          <h2 className="mt-2 text-[28px] font-bold leading-[1.15] text-[#202127] md:text-[34px]">
            Start learning for free
          </h2>
          <p className="mt-3 text-[14px] leading-[1.65] text-[#4e515c] md:text-[15px]">
            Learn at your own pace. Every free course includes its lessons, assessments and completion certificate at no charge.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/free"
            className="inline-flex h-[42px] items-center justify-center rounded-full bg-[#07004d] px-6 text-[13px] font-semibold text-white transition hover:bg-[#181c7b]"
          >
            Explore courses
          </Link>
          <Link
            href="/free"
            className="inline-flex h-[42px] items-center justify-center rounded-full border border-[#07004d] px-6 text-[13px] font-semibold text-[#07004d] transition hover:bg-[#f6f6fb]"
          >
            Start learning for free
          </Link>
        </div>
      </header>

      <div className="space-y-10">
        {groups.map((group) => {
          const category = categorySlug(group.category);
          return (
            <section key={group.category} aria-labelledby={`free-group-${category}`}>
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <h3 id={`free-group-${category}`} className="text-[19px] font-bold text-[#202127] md:text-[22px]">
                    {group.category}
                  </h3>
                  <p className="mt-1 text-[13px] text-[#717480]">{group.description}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <Link
                    href={`/free?category=${category}`}
                    className="text-[13px] font-semibold text-[#07004d] hover:underline"
                  >
                    View all
                  </Link>
                  <div className="hidden gap-1 sm:flex">
                    <button
                      type="button"
                      aria-label={`Scroll ${group.category} courses left`}
                      onClick={() => scrollRow(group.category, -1)}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e1e3ec] text-[#37394b] transition hover:bg-[#f5f6fa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#07004d]"
                    >
                      <FiChevronLeft aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Scroll ${group.category} courses right`}
                      onClick={() => scrollRow(group.category, 1)}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e1e3ec] text-[#37394b] transition hover:bg-[#f5f6fa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#07004d]"
                    >
                      <FiChevronRight aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>

              <div
                ref={(node) => { rows.current[group.category] = node; }}
                className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-3 [scrollbar-width:thin] sm:gap-5"
                aria-label={`${group.category} free courses`}
              >
                {group.courses.map((course) => (
                  <div
                    key={course.slug}
                    className="w-[82vw] max-w-[340px] shrink-0 snap-start sm:w-[calc((100%-1.25rem)/2)] sm:max-w-none lg:w-[calc((100%-2.5rem)/3)] xl:w-[calc((100%-4.5rem)/4)]"
                  >
                    <CourseCard
                      href={`/courses/${course.slug}`}
                      title={course.title}
                      image={course.thumbnail}
                      provider={course.sourceName}
                      providerAvatar
                      tag={course.programme}
                      meta={[course.level, `${course.videos.length} video lessons`, `${course.videoHours} hours`]}
                      priceLabel="Free"
                    />
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/free"
          className="inline-flex h-[46px] items-center justify-center rounded-full border border-[#181c7b] px-8 text-[14px] font-semibold text-[#181c7b] transition hover:bg-[#f6f6fb]"
        >
          View all free courses
        </Link>
      </div>
    </ScrollReveal>
  );
};

export default FreeCourses;
