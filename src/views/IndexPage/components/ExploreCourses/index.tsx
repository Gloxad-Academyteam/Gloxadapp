"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight, FaStar, FaBullseye } from "react-icons/fa6";
import { IoColorPaletteOutline } from "react-icons/io5";
import { MdOutlineDeveloperMode } from "react-icons/md";
import { FaChartSimple } from "react-icons/fa6";
import ScrollReveal from "@components/ScrollReveal";
import CourseBrandDesign from "@assets/images/course-brand-design.png";
import CourseFigmaUiux from "@assets/images/course-figma-uiux.png";
import CourseMotionDesign from "@assets/images/course-motion-design.png";
import CourseUiuxBeginner from "@assets/images/course-uiux-beginner.png";
import FreeGraphicDesign from "@assets/images/free-graphic-design.png";
import FreePython from "@assets/images/free-python.png";
import FreeSeo from "@assets/images/free-seo.png";
import FreeSupport from "@assets/images/free-support.png";

const courseTabs = [
  { id: "design", title: "Design", icon: IoColorPaletteOutline, to: "/courses?category=design" },
  { id: "software-development", title: "Software Development", icon: MdOutlineDeveloperMode, to: "/courses?category=software-development" },
  { id: "data-science", title: "Data Science & Analytics", icon: FaChartSimple, to: "/courses?category=data-science" },
  { id: "marketing-seo", title: "Marketing & SEO", icon: FaBullseye, to: "/courses?category=marketing-seo" },
  { id: "business", title: "Business & Entrepreneurship", icon: FaBullseye, to: "/courses?category=business" },
];

const featuredCoursesByTab: Record<string, any[]> = {
  "design": [
    { title: "Figma: From Zero to Pro", author: "Jane R", rating: "4.9", price: "₦8,000", image: CourseFigmaUiux, to: "/courses?search=figma" },
    { title: "UI/UX Design for Beginners", author: "David O", rating: "5.0", price: "₦5,000", image: CourseUiuxBeginner, to: "/courses?search=ui-ux-design" },
    { title: "Brand Design A-Z", author: "Emmanuel D", rating: "5.0", price: "₦6,000", image: CourseBrandDesign, to: "/courses?search=brand-design" },
    { title: "Motion Design", author: "Michael K", rating: "4.5", price: "₦10,000", image: CourseMotionDesign, to: "/courses?search=motion-design" },
  ],
  "software-development": [
    { title: "Figma: From Zero to Pro", author: "Jane R", rating: "5.0", price: "₦8,000", image: CourseFigmaUiux, to: "/courses?search=web-development" },
    { title: "Machine Learning with Python", author: "Olivia W", rating: "5.0", price: "₦9,000", image: FreePython, to: "/courses?search=machine-learning" },
    { title: "Brand Design A-Z", author: "Emmanuel D", rating: "5.0", price: "₦6,000", image: CourseBrandDesign, to: "/courses?search=javascript" },
    { title: "React JS", author: "Jason B", rating: "4.5", price: "₦10,000", image: CourseMotionDesign, to: "/courses?search=react" },
  ],
  "data-science": [
    { title: "Figma: From Zero to Pro", author: "Jane R", rating: "4.9", price: "₦8,000", image: FreeGraphicDesign, to: "/courses?search=excel" },
    { title: "Machine Learning with Python", author: "Olivia W", rating: "5.0", price: "₦9,000", image: FreeSeo, to: "/courses?search=data-science" },
    { title: "Brand Design A-Z", author: "Emmanuel D", rating: "4.0", price: "₦6,000", image: CourseUiuxBeginner, to: "/courses?search=data-analytics" },
    { title: "Excel Masterclass", author: "Michael K", rating: "4.5", price: "₦10,000", image: FreeSupport, to: "/courses?search=excel-masterclass" },
  ],
  "marketing-seo": [
    { title: "Digital Marketing 101", author: "Sarah L", rating: "4.8", price: "₦7,500", image: CourseUiuxBeginner, to: "/courses?search=digital-marketing" },
    { title: "SEO Optimization Guide", author: "David O", rating: "4.7", price: "₦5,500", image: CourseBrandDesign, to: "/courses?search=seo" },
  ],
  "business": [
    { title: "Entrepreneurship Basics", author: "Mark S", rating: "4.9", price: "₦8,500", image: CourseMotionDesign, to: "/courses?search=business" },
  ],
};

const ExploreCourses = () => {
  const router = useRouter();
  const tabsRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeTabTitle, setActiveTabTitle] = useState("Design");

  const activeTabId = courseTabs.find((t) => t.title === activeTabTitle)?.id || "design";
  const featuredCourses = featuredCoursesByTab[activeTabId] || [];

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
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0.15, once: true }}
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        className="mt-8 flex w-full max-w-[1272px] gap-4 overflow-x-auto pb-2 snap-x snap-mandatory -mx-5 px-5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-[20px] sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4"
      >
        {featuredCourses.map((course) => (
          <motion.article
            key={course.title}
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
            }}
            whileHover={{ y: -4 }}
            onClick={() => router.push(course.to)}
            className="flex w-[75vw] shrink-0 snap-center cursor-pointer flex-col overflow-hidden rounded-[12px] border border-[#dedee7] bg-white transition-shadow duration-300 hover:shadow-lg sm:w-auto sm:shrink sm:snap-none"
          >
            <div className="p-3">
              <img src={course.image.src} alt={course.title} className="h-[180px] w-full rounded-[8px] object-cover" />
            </div>
            <div className="flex flex-1 flex-col p-5 pt-2">
              <h3 className="text-[17px] font-bold leading-[1.3] text-[#202127]">{course.title}</h3>
              <p className="mt-2 text-[14px] text-[#717480]">{course.author}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-[14px] font-medium text-[#717480]">{course.rating}</span>
                <span className="flex gap-0.5 text-[#ff8800] text-[14px]">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <FaStar key={index} />
                  ))}
                </span>
              </div>
              <div className="mt-auto pt-4">
                <p className="text-[20px] font-bold text-[#202127]">{course.price}</p>
              </div>
            </div>
          </motion.article>
        ))}
      </motion.div>

      <div className="w-full max-w-[1272px] flex justify-start">
        <button
          type="button"
          onClick={() => router.push("/courses")}
          className="btn-interactive mt-10 h-[46px] w-[187px] rounded-full bg-[#07004d] text-[15px] font-medium text-white transition hover:bg-[#111456]"
        >
          Browse All Courses
        </button>
      </div>
    </ScrollReveal>
  );
};

export default ExploreCourses;
