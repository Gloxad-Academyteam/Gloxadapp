"use client";

import React from "react";
import { useRouter } from "next/navigation";

// Images (reusing from existing assets)
import FreePython from "@assets/images/free-python.png";
import FreeGraphicDesign from "@assets/images/free-graphic-design.png";
import FreeSeo from "@assets/images/free-seo.png";
import CourseBrandDesign from "@assets/images/course-brand-design.png";
import CourseFigmaUiux from "@assets/images/course-figma-uiux.png";
import CourseMotionDesign from "@assets/images/course-motion-design.png";

const freeCourses = [
  {
    title: "Intro to Python Programming",
    description: "Master the basics of Python, one of the most in-demand programming languages.",
    duration: "4 hours",
    level: "Beginner",
    image: FreePython,
    to: "/courses?search=python",
  },
  {
    title: "Basics of Graphic Design",
    description: "Learn fundamental design principles and start creating visually stunning graphics.",
    duration: "3 hours",
    level: "Beginner",
    image: FreeGraphicDesign,
    to: "/courses?search=graphic-design",
  },
  {
    title: "SEO for Beginners",
    description: "Boost your website's visibility with SEO fundamentals and best practices.",
    duration: "2.5 hours",
    level: "Beginner",
    image: FreeSeo,
    to: "/courses?search=seo",
  },
  {
    title: "Cyber-Security",
    description: "Get started with data analysis, SQL, Python, and visualization tools like Tableau & PowerBI.",
    duration: "3 hours",
    level: "Intermediate Level",
    image: CourseBrandDesign,
    to: "/courses?search=cyber-security",
  },
  {
    title: "Web Development",
    description: "Learn front-end and back-end development using HTML, and CSS.",
    duration: "3 hours",
    level: "Beginners Level",
    image: CourseFigmaUiux,
    to: "/courses?search=web-development",
  },
  {
    title: "UI/UX Design",
    description: "Master the art of user experience and interface design.",
    duration: "3 hours",
    level: "Beginner Friendly",
    image: CourseMotionDesign,
    to: "/courses?search=ui-ux",
  },
];

const FreeCoursesPage = () => {
  const router = useRouter();

  return (
    <div className="w-full bg-white font-sans">
      <main className="mx-auto min-h-[60vh] w-full max-w-[1512px] px-5 py-10 md:px-10 md:py-14 lg:px-8 xl:px-[120px]">
        {/* Header */}
        <div className="mx-auto mb-10 max-w-[720px] text-center md:mb-14">
          <h1 className="text-[28px] font-semibold text-[#201633] md:text-[36px]">Free Courses</h1>
          <p className="mt-3 text-[14px] leading-relaxed text-[#4e515c] md:text-[15px]">
            Explore our free courses and upgrade anytime to get a certificate!
          </p>
        </div>

        {/* Grid: 1 col mobile, 2 tablet, 4 desktop */}
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-4">
          {freeCourses.map((course, index) => (
            <article key={`${course.title}-${index}`} className="card-interactive group flex flex-col">
              <div className="overflow-hidden rounded-[10px] bg-[#f4f5f8]">
                <img
                  src={course.image.src}
                  alt={course.title}
                  className="h-[180px] w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-[190px]"
                />
              </div>
              <div className="flex flex-1 flex-col pt-4">
                <h3 className="line-clamp-2 text-[15px] font-bold leading-tight text-[#201633]">{course.title}</h3>
                <p className="mt-2 line-clamp-3 flex-1 text-[13px] leading-[1.55] text-[#6b6d76]">{course.description}</p>
                <p className="mt-3 text-[12px] font-medium text-[#F97316]">Duration: {course.duration}</p>
                <p className="mt-1 text-[12px] text-[#8a8c95]">{course.level}</p>
                <button
                  type="button"
                  onClick={() => router.push(course.to)}
                  className="btn-interactive mt-4 h-[36px] w-max rounded-full bg-[#07004d] px-6 text-[13px] font-medium text-white transition hover:bg-[#111456]"
                >
                  Start Learning
                </button>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
};

export default FreeCoursesPage;
