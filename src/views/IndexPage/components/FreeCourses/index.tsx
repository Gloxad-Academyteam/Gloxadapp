"use client";

import Link from "next/link";
import CourseCard, { COURSE_GRID } from "@components/CourseCard";
import ScrollReveal from "@components/ScrollReveal";
import { youtubeFreeCatalogCourses } from "@services/catalog";

// One free course from each of four fields: enough to get a feel, with the full list a click away
const FEATURED_CATEGORIES = ["Software Development", "Data Science & Analytics", "Artificial Intelligence", "Design"];

const featured = FEATURED_CATEGORIES.map((category) => youtubeFreeCatalogCourses.find((course) => course.category === category)).filter(
  (course): course is (typeof youtubeFreeCatalogCourses)[number] => Boolean(course)
);

const FreeCourses = () => (
  <ScrollReveal className="mx-auto w-full max-w-[1512px] px-5 py-12 md:px-10 md:py-16 lg:px-[120px]">
    <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-[620px]">
        <h2 className="text-[28px] font-bold leading-[1.15] text-[#202127] md:text-[34px]">Start learning for free</h2>
        <p className="mt-3 text-[14px] leading-[1.65] text-[#4e515c] md:text-[15px]">
          Learn at your own pace. Every free course has its lessons, a quiz and a task after each module, and a completion certificate at no charge.
        </p>
      </div>
      <Link
        href="/free"
        className="inline-flex h-[44px] shrink-0 items-center justify-center rounded-full bg-[#0B1F4D] px-6 text-[14px] font-semibold text-white shadow-[0_2px_8px_rgba(11,31,77,0.25)] transition hover:bg-[#13306f]"
      >
        View all free courses
      </Link>
    </header>

    <div className={COURSE_GRID}>
      {featured.map((course) => (
        <CourseCard
          key={course.slug}
          href={`/courses/${course.slug}`}
          title={course.title}
          image={course.thumbnail}
          provider={course.sourceName}
          providerAvatar
          tag={course.programme}
          meta={[course.level, `${course.videos.length} video lessons`, `${course.videoHours} hours`]}
          priceLabel="Free"
        />
      ))}
    </div>
  </ScrollReveal>
);

export default FreeCourses;
