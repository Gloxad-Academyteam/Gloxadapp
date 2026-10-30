"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FaChevronLeft, FaChevronRight, FaBullseye, FaBitcoin, FaCloud, FaRobot, FaLayerGroup, FaLaptop, FaGraduationCap } from "react-icons/fa6";
import { IoColorPaletteOutline } from "react-icons/io5";
import { MdOutlineDeveloperMode } from "react-icons/md";
import { FaChartSimple } from "react-icons/fa6";
import { PiBriefcase } from "react-icons/pi";
import CourseCard from "@components/CourseCard";
import ScrollReveal from "@components/ScrollReveal";
import { catalogCourses, categorySlug } from "@services/catalog";

// Tabs map onto the catalog categories (services/catalog); "All Courses" lists the full catalog
const ALL_COURSES = "All Courses";
const courseTabs = [
  { id: ALL_COURSES, title: ALL_COURSES, icon: FaLayerGroup },
  { id: "Software Development", title: "Software Development", icon: MdOutlineDeveloperMode },
  { id: "Design", title: "Design", icon: IoColorPaletteOutline },
  { id: "Data Science & Analytics", title: "Data Science & Analytics", icon: FaChartSimple },
  { id: "Artificial Intelligence", title: "Artificial Intelligence", icon: FaRobot },
  { id: "Cloud & Cybersecurity", title: "Cloud & Cybersecurity", icon: FaCloud },
  { id: "Marketing & Sales", title: "Marketing & Sales", icon: FaBullseye },
  { id: "Business & Entrepreneurship", title: "Business & Entrepreneurship", icon: PiBriefcase },
  { id: "Blockchain", title: "Blockchain", icon: FaBitcoin },
  { id: "Foundations", title: "Foundations", icon: FaLaptop },
  { id: "Test Preparation", title: "Test Preparation", icon: FaGraduationCap },
];

const ExploreCourses = () => {
  const router = useRouter();
  const tabsRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeTabTitle, setActiveTabTitle] = useState(courseTabs[0].title);

  const activeTabId = courseTabs.find((t) => t.title === activeTabTitle)?.id || courseTabs[0].id;
  // Academic programmes first, then short courses and bootcamps
  const featuredCourses = catalogCourses
    .filter((course) => activeTabId === ALL_COURSES || course.category === activeTabId)
    .sort((a, b) => Number(b.type === "academic") - Number(a.type === "academic"));

  const checkScroll = () => {
    if (tabsRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const handleTabScroll = (direction: "left" | "right") => {
    if (tabsRef.current) {
      const scrollAmount = direction === "left" ? -280 : 280;
      tabsRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <ScrollReveal className="mx-auto flex w-full max-w-[1512px] flex-col items-center px-5 py-[48px] md:px-10 lg:px-[120px]">
      <div className="w-full max-w-[1272px]">
        <h2 className="text-[28px] font-semibold leading-[1.2] text-[#202127] md:text-[36px]">
          Explore a Wide Range of Courses
        </h2>
        <p className="mt-3 max-w-[680px] text-[15px] font-normal leading-[1.5] text-[#4e515c]">
          <span className="sm:hidden">Courses for every stage of your journey.</span>
          <span className="hidden sm:inline">Whether you&apos;re starting fresh or upskilling, we have courses designed for you. Choose from various fields and kickstart your journey.</span>
        </p>
      </div>

      {/* Category filter pills — same scrollable row on every breakpoint, arrows only appear when there's overflow to scroll */}
      <div className="relative mt-8 w-full max-w-[1272px]">
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => handleTabScroll("left")}
            aria-label="Scroll categories left"
            className="absolute -left-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#dedee7] bg-white/95 text-[#202127] shadow-md backdrop-blur-sm transition-all hover:scale-110 hover:bg-gray-50 active:scale-95"
          >
            <FaChevronLeft className="text-[12px]" />
          </button>
        )}
        {canScrollRight && (
          <button
            type="button"
            onClick={() => handleTabScroll("right")}
            aria-label="Scroll categories right"
            className="absolute -right-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#dedee7] bg-white/95 text-[#202127] shadow-md backdrop-blur-sm transition-all hover:scale-110 hover:bg-gray-50 active:scale-95"
          >
            <FaChevronRight className="text-[12px]" />
          </button>
        )}

        <div
          ref={tabsRef}
          onScroll={checkScroll}
          className="flex w-full gap-3 overflow-x-auto py-1 px-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {courseTabs.map((tab) => {
            const isActive = activeTabTitle === tab.title;
            return (
              <button
                key={tab.title}
                type="button"
                onClick={() => setActiveTabTitle(tab.title)}
                className={`group flex h-[42px] items-center gap-2.5 rounded-full border px-5 text-[14px] font-semibold whitespace-nowrap transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 ${
                  isActive
                    ? "border-[#202127] bg-[#202127] text-white shadow-md shadow-black/10"
                    : "border-[#e2e4ed] bg-white text-[#4e515c] shadow-xs hover:border-[#b0b3c4] hover:bg-gray-50/90 hover:text-[#202127]"
                }`}
              >
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full transition-colors ${
                    isActive ? "bg-white/20 text-white" : "bg-[#f0f1f7] text-[#5c5f6a] group-hover:bg-[#e4e6f0] group-hover:text-[#202127]"
                  }`}
                >
                  <tab.icon className="text-[13px]" />
                </div>
                {tab.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* ===================== MOBILE (below sm) — swipeable snap-scroll carousel ===================== */}
      {/* ===================== DESKTOP (sm and up) — static grid ===================== */}
      {/* No per-card scroll reveal: with every course listed the grid is taller than the screen, and inside the
          mobile carousel cards scrolled in sideways never registered as in view, so they stayed invisible */}
      <div
        className="mt-8 flex w-full max-w-[1272px] gap-4 overflow-x-auto pb-2 snap-x snap-mandatory -mx-5 px-5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3"
      >
        {featuredCourses.map((course) => (
          <div key={course.slug} className="w-[82vw] shrink-0 snap-center sm:w-auto sm:shrink sm:snap-none">
            <CourseCard
              href={`/courses/${course.slug}`}
              title={course.title}
              image={course.thumbnail}
              provider="Gloxad Academy"
              tag={course.programme}
              meta={[`${course.videos.length} video lessons`, `${course.videoHours} hours`]}
              priceLabel={course.priceLabel}
            />
          </div>
        ))}
      </div>

      <div className="w-full max-w-[1272px] flex justify-start">
        <button
          type="button"
          onClick={() => router.push(activeTabId === ALL_COURSES ? "/courses" : `/courses?category=${categorySlug(activeTabId)}`)}
          className="btn-interactive mt-10 h-[46px] rounded-full bg-[#07004d] px-7 text-[15px] font-medium text-white transition hover:bg-[#111456]"
        >
          {activeTabId === ALL_COURSES ? `Browse All ${catalogCourses.length} Courses` : `Browse All ${activeTabTitle} Courses`}
        </button>
      </div>
    </ScrollReveal>
  );
};

export default ExploreCourses;
