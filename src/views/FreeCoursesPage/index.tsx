"use client";

import { COURSE_GRID } from "@components/CourseCard";
import React, { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { FiBookOpen, FiCheck, FiClock, FiSearch } from "react-icons/fi";
import axiosInstance from "@utils/axiosInstance";
import { CATALOG_CATEGORIES, categorySlug, youtubeFreeCatalogCourses, CATALOG_PROVIDER_NOTE, normaliseApiCourse } from "@services/catalog";
import { getYouTubeSourceName, isCourseVisible, isFreeYouTubeCourse } from "@utils/courseSource";

const PAGE_SIZE = 12;

const durationInHours = (course: any) => {
  const value = Number(course.videoHours ?? course.durationHours);
  if (Number.isFinite(value) && value > 0) return value;
  const hours = String(course.duration || "").match(/([\d.]+)\s*(?:hours?|hrs?)/i);
  return hours ? Number(hours[1]) : 0;
};

const courseCategory = (course: any) => typeof course.category === "string" ? course.category : course.category?.name || course.programme || "Other courses";
const courseLevel = (course: any) => course.level || course.levels?.[0] || "";
const courseLessonCount = (course: any) => Array.isArray(course.videos)
  ? course.videos.length
  : (course.modules || []).reduce((count: number, module: any) => count + (module.lessons?.length || 0), 0);
const normaliseSearch = (value: string) => value.toLowerCase().replace(/[-_]+/g, " ").trim();

const fetchPublishedFreeCourses = async () => {
  try {
    const params = { courseType: "free", limit: 50, page: 1 };
    const first = await axiosInstance.get("/courses", { params, timeout: 8000 });
    const totalPages = Math.max(1, Number(first.data?.pagination?.totalPages) || 1);
    const remaining = await Promise.all(
      Array.from({ length: totalPages - 1 }, (_, index) =>
        axiosInstance.get("/courses", { params: { ...params, page: index + 2 }, timeout: 8000 }),
      ),
    );
    return [first, ...remaining]
      .flatMap((response) => response.data?.courses || response.data?.data || [])
      .filter((course: any) => {
        const status = String(course.status || "").toLowerCase();
        return isCourseVisible(course) && isFreeYouTubeCourse(course) && course.isPublished !== false && (!status || status === "published");
      })
      .map(normaliseApiCourse);
  } catch {
    return [];
  }
};

const FreeCoursesContent = () => {
  const router = useRouter();
  const pathname = usePathname() ?? "/free";
  const searchParams = useSearchParams();
  const activeCategory = searchParams?.get("category") ?? "";
  const [search, setSearch] = useState(searchParams?.get("search") ?? "");
  const [level, setLevel] = useState("");
  const [duration, setDuration] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const { data: apiCourses = [] } = useQuery({
    queryKey: ["free.public-catalog"],
    queryFn: fetchPublishedFreeCourses,
    staleTime: 60_000,
  });

  const allCourses = useMemo(() => {
    const apiTitles = new Set(apiCourses.map((course: any) => String(course.title || "").trim().toLowerCase()));
    return [
      ...apiCourses,
      ...youtubeFreeCatalogCourses.filter((course) => !apiTitles.has(course.title.trim().toLowerCase())),
    ];
  }, [apiCourses]);

  useEffect(() => {
    setSearch(searchParams?.get("search") ?? "");
    setVisibleCount(PAGE_SIZE);
  }, [searchParams]);

  const levels = useMemo(
    () => Array.from(new Set(allCourses.map(courseLevel).filter(Boolean))).sort(),
    [allCourses],
  );
  const filteredCourses = useMemo(() => {
    const query = normaliseSearch(search);
    const categoryKey = activeCategory ? categorySlug(activeCategory) : "";
    return allCourses.filter((course: any) => {
      const category = courseCategory(course);
      if (categoryKey && categorySlug(category) !== categoryKey) return false;
      if (query) {
        const haystack = normaliseSearch([
          course.title,
          course.subtitle,
          course.description,
          category,
          course.programme,
          ...(Array.isArray(course.skills) ? course.skills : []),
        ].filter(Boolean).join(" "));
        if (!query.split(/\s+/).every((word) => haystack.includes(word))) return false;
      }
      if (level && courseLevel(course) !== level) return false;
      const hours = durationInHours(course);
      if (duration === "short" && (!hours || hours >= 10)) return false;
      if (duration === "medium" && (hours < 10 || hours >= 40)) return false;
      if (duration === "long" && hours < 40) return false;
      return true;
    });
  }, [activeCategory, allCourses, duration, level, search]);

  const setCategory = (category: string) => {
    const params = new URLSearchParams(searchParams?.toString());
    if (category) params.set("category", categorySlug(category));
    else params.delete("category");
    params.delete("search");
    const query = params.toString();
    router.push(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
    setSearch("");
    setVisibleCount(PAGE_SIZE);
  };

  const clearFilters = () => {
    router.push(pathname, { scroll: false });
    setSearch("");
    setLevel("");
    setDuration("");
    setVisibleCount(PAGE_SIZE);
  };

  const shownCourses = filteredCourses.slice(0, visibleCount);
  const hasFilters = !!(search.trim() || activeCategory || level || duration);

  return (
    <div className="w-full bg-white font-sans text-[#201633]">
      <main className="mx-auto min-h-[60vh] w-full max-w-[1512px] px-5 py-10 md:px-10 md:py-14 lg:px-8 xl:px-[120px]">
        <header className="mx-auto mb-8 max-w-[760px] text-center md:mb-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#eef2ff] px-3 py-1.5 text-[12px] font-bold text-[#181c7b]">
            <FiCheck aria-hidden="true" /> 100% free
          </span>
          <h1 className="mt-4 text-[28px] font-semibold md:text-[36px]">Free Courses</h1>
          <p className="mt-3 text-[14px] leading-relaxed text-[#4e515c] md:text-[15px]">
            Every course here is free. Lessons, assessments and your completion certificate are included at no charge.
          </p>
        </header>

        <section aria-label="Find a free course" className="mb-8 rounded-2xl border border-[#e7e8ef] bg-[#fafbfe] p-4 md:p-5">
          <div className="grid gap-3 md:grid-cols-[minmax(220px,1fr)_repeat(2,minmax(150px,190px))]">
            <label className="flex h-[46px] items-center gap-3 rounded-xl border border-[#dfe1e9] bg-white px-4 focus-within:border-[#07004d] focus-within:ring-2 focus-within:ring-[#07004d]/10">
              <FiSearch className="shrink-0 text-[#717480]" aria-hidden="true" />
              <span className="sr-only">Search free courses</span>
              <input
                type="search"
                value={search}
                onChange={(event) => { setSearch(event.target.value); setVisibleCount(PAGE_SIZE); }}
                placeholder="Search by course or skill"
                className="w-full border-0 bg-transparent p-0 text-[14px] outline-none placeholder:text-[#9294a0] focus:ring-0"
              />
            </label>
            <label className="flex h-[46px] items-center rounded-xl border border-[#dfe1e9] bg-white px-3">
              <span className="sr-only">Filter by level</span>
              <select value={level} onChange={(event) => { setLevel(event.target.value); setVisibleCount(PAGE_SIZE); }} className="w-full border-0 bg-transparent text-[13px] text-[#37394b] focus:ring-0">
                <option value="">All levels</option>
            {levels.map((item: string) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
            <label className="flex h-[46px] items-center rounded-xl border border-[#dfe1e9] bg-white px-3">
              <span className="sr-only">Filter by duration</span>
              <select value={duration} onChange={(event) => { setDuration(event.target.value); setVisibleCount(PAGE_SIZE); }} className="w-full border-0 bg-transparent text-[13px] text-[#37394b] focus:ring-0">
                <option value="">Any duration</option>
                <option value="short">Under 10 hours</option>
                <option value="medium">10 to 39 hours</option>
                <option value="long">40 hours or more</option>
              </select>
            </label>
          </div>

          <nav aria-label="Filter by category" className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:flex-wrap">
            <button
              type="button"
              onClick={() => setCategory("")}
              aria-pressed={!activeCategory}
              className={`shrink-0 rounded-full border px-4 py-2 text-[12px] font-semibold transition ${!activeCategory ? "border-[#07004d] bg-[#07004d] text-white" : "border-[#dfe1e9] bg-white text-[#4e515c] hover:border-[#999bb1]"}`}
            >
              All categories
            </button>
            {CATALOG_CATEGORIES.map((category) => {
              const active = categorySlug(activeCategory) === categorySlug(category);
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setCategory(category)}
                  aria-pressed={active}
                  className={`shrink-0 rounded-full border px-4 py-2 text-[12px] font-semibold transition ${active ? "border-[#07004d] bg-[#07004d] text-white" : "border-[#dfe1e9] bg-white text-[#4e515c] hover:border-[#999bb1]"}`}
                >
                  {category}
                </button>
              );
            })}
          </nav>
        </section>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <p className="text-[13px] text-[#717480]" aria-live="polite">
            <span className="font-semibold text-[#202127]">{filteredCourses.length}</span> {filteredCourses.length === 1 ? "course" : "courses"}
            {activeCategory ? ` in ${CATALOG_CATEGORIES.find((item) => categorySlug(item) === categorySlug(activeCategory)) || activeCategory}` : " available"}
          </p>
          {hasFilters && <button type="button" onClick={clearFilters} className="text-[12px] font-semibold text-[#07004d] hover:underline">Clear filters</button>}
        </div>

        {shownCourses.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#dfe1e9] px-6 py-16 text-center">
            <FiBookOpen className="mx-auto text-[28px] text-[#8b8e9d]" aria-hidden="true" />
            <h2 className="mt-4 text-[18px] font-bold text-[#202127]">No courses match those filters</h2>
            <p className="mt-2 text-[14px] text-[#717480]">Try another search or clear the filters.</p>
            {hasFilters && <button type="button" onClick={clearFilters} className="mt-5 rounded-full bg-[#07004d] px-5 py-2.5 text-[13px] font-semibold text-white">Clear filters</button>}
          </div>
        ) : (
          <div className={COURSE_GRID}>
            {shownCourses.map((course) => {
              const hours = durationInHours(course);
              const slug = course.slug || course._id;
              const thumbnail = course.thumbnail || course.thumbnailUrl || "/og-image.jpg";
              const category = courseCategory(course);
              const lessonCount = courseLessonCount(course);
              return (
                <article key={course._id || course.slug} className="cc flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-[#e3e5ee] bg-white transition hover:border-[#c3c7d9] hover:shadow-[0_8px_24px_rgba(20,20,60,0.08)]">
                  <Link href={`/courses/${slug}`} className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#07004d]">
                    <div className="relative aspect-video w-full overflow-hidden bg-[#eef0f7]">
                      <img src={thumbnail} alt="" loading="lazy" className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]" />
                      <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-[11px] font-bold text-[#167343] shadow-sm">Free</span>
                    </div>
                  </Link>
                  <div className="cc-body flex flex-1 flex-col">
                    <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#4b4ca5]">{category}</p>
                    <Link href={`/courses/${slug}`} className="cc-title mt-1 line-clamp-2 font-bold leading-snug text-[#202127] hover:text-[#07004d] focus-visible:underline">
                      {course.title}
                    </Link>
                    <p className="cc-meta mt-2 line-clamp-2 text-[#717480]">{course.subtitle || course.description}</p>
                    <div className="cc-meta mt-4 flex flex-wrap gap-x-3 gap-y-2 text-[#555866]">
                      {courseLevel(course) && <span>{courseLevel(course)}</span>}
                      <span className="inline-flex items-center gap-1"><FiBookOpen aria-hidden="true" /> {lessonCount} lessons</span>
                      {hours > 0 && <span className="inline-flex items-center gap-1"><FiClock aria-hidden="true" /> {hours} hours</span>}
                      {getYouTubeSourceName(course) && <span className="truncate">By {getYouTubeSourceName(course)}</span>}
                    </div>
                    <div className="cc-actions mt-auto grid grid-cols-2 gap-2 pt-5">
                      <Link href={`/courses/${slug}`} className="inline-flex h-10 items-center justify-center rounded-full border border-[#07004d] px-3 text-[12px] font-semibold text-[#07004d] transition hover:bg-[#f6f6fb]">
                        View course
                      </Link>
                      <Link href={`/courses/${slug}?enrol=1`} className="inline-flex h-10 items-center justify-center rounded-full bg-[#07004d] px-3 text-[12px] font-semibold text-white transition hover:bg-[#181c7b]">
                        Enrol for free
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {visibleCount < filteredCourses.length && (
          <div className="mt-9 text-center">
            <button type="button" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)} className="inline-flex h-11 items-center justify-center rounded-full border border-[#181c7b] px-7 text-[13px] font-semibold text-[#181c7b] transition hover:bg-[#f6f6fb]">
              Load more courses
            </button>
          </div>
        )}
        <p className="mt-12 text-center text-[12px] leading-relaxed text-[#858795]">{CATALOG_PROVIDER_NOTE}</p>
      </main>
    </div>
  );
};

const FreeCoursesPage = () => (
  <Suspense fallback={<div className="min-h-[60vh] bg-white" aria-label="Loading free courses" />}>
    <FreeCoursesContent />
  </Suspense>
);

export default FreeCoursesPage;
