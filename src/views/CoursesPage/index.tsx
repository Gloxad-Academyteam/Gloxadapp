"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useAuth from "@hooks/useAuth";
import { FaSearch } from "react-icons/fa";
import { useCoursesPage } from "./hooks/useCoursesPage";
import ExploreCourseCard from "./components/ExploreCourseCard";
import { CATALOG_CATEGORIES, CATALOG_VIDEO_CREDIT, categorySlug } from "@services/catalog";

// The public /courses list needs an account; /dashboard/explore is already behind the dashboard guard
const CoursesPageGate = () => {
  const router = useRouter();
  const pathname = usePathname() ?? "/courses";
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading } = useAuth();
  const needsSignIn = pathname.startsWith("/courses") && !isLoading && !isAuthenticated;
  // A returning user with a stored session sees the courses while /auth/me is still answering
  const [hasStoredSession, setHasStoredSession] = useState(false);
  useEffect(() => {
    try {
      setHasStoredSession(!!localStorage.getItem("token"));
    } catch {
      // Storage blocked: wait for /auth/me as before
    }
  }, []);

  useEffect(() => {
    if (!needsSignIn) return;
    const query = searchParams?.toString();
    router.replace(`/auth/signin?redirect=${encodeURIComponent(query ? `${pathname}?${query}` : pathname)}`);
  }, [needsSignIn, pathname, router, searchParams]);

  if ((isLoading && !hasStoredSession) || needsSignIn) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-5 text-center">
        <p className="text-[15px] text-[#4e515c]">{needsSignIn ? "Sign in to explore our courses…" : "Loading…"}</p>
      </div>
    );
  }

  return <CoursesPageContent />;
};

const CoursesPageContent = () => {
  const pathname = usePathname() ?? "/courses";
  const { courses, isLoading, error, category, searchQuery, setSearchQuery } = useCoursesPage();
  const activeCategory = CATALOG_CATEGORIES.find((name) => categorySlug(name) === categorySlug(category));

  return (
    <div className="mx-auto min-h-[60vh] w-full max-w-[1512px] px-5 py-10 md:px-10 md:py-14 lg:px-8 xl:px-[120px]">

      {/* Header Area */}
      <div className="mx-auto mb-8 flex max-w-[800px] flex-col items-center gap-3 text-center md:mb-10">
        <h1 className="text-[28px] font-semibold text-[#201633] md:text-[36px]">
          {activeCategory ?? "Explore Courses"}
        </h1>
        <p className="max-w-[600px] text-[14px] leading-relaxed text-[#4e515c] md:text-[15px]">
          Academic programmes, short courses, bootcamps and professional training to help you learn new skills, grow your expertise, and achieve your goals.
        </p>
      </div>

      {/* Search + category filters */}
      <div className="mb-10 flex flex-col gap-4">
        <label className="mx-auto flex h-[46px] w-full max-w-[520px] items-center gap-3 rounded-full border border-[#dedee7] bg-white px-5 focus-within:border-[#07004d]">
          <FaSearch className="text-[14px] text-[#8a8c95]" />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search courses, e.g. Python, design, cloud"
            className="w-full border-0 bg-transparent p-0 text-[14px] placeholder:text-[#a4a5ad] focus:ring-0"
          />
        </label>
        <nav aria-label="Course categories" className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:flex-wrap md:justify-center">
          {[null, ...CATALOG_CATEGORIES].map((name) => {
            const isActive = name ? activeCategory === name : !activeCategory;
            return (
              <Link
                key={name ?? "all"}
                href={name ? `${pathname}?category=${categorySlug(name)}` : pathname}
                className={`shrink-0 rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors ${
                  isActive
                    ? "border-[#07004d] bg-[#07004d] text-white"
                    : "border-[#e2e4ed] bg-white text-[#4e515c] hover:border-[#b0b3c4] hover:text-[#202127]"
                }`}
              >
                {name ?? "All courses"}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="w-full">
        {isLoading ? (
          <div className="w-full h-[40vh] flex items-center justify-center">
            <p className="text-title-large text-neutral-8 animate-pulse">Loading courses...</p>
          </div>
        ) : error ? (
          <div className="w-full h-[40vh] flex items-center justify-center">
            <p className="text-title-large text-error-5">Failed to load courses. Please try again.</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="bg-white rounded-[16px] p-12 text-center border-[1px] border-neutral-4 shadow-sm">
            <h2 className="text-title-large font-bold text-neutral-10 mb-2">No courses found</h2>
            <p className="text-body-medium text-neutral-7">Try adjusting your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {courses.map((course: any) => {
              const frontendCourse = {
                id: course._id,
                title: course.title,
                description: course.description,
                imageUrl: course.thumbnail || course.thumbnailUrl || "/og-image.jpg",
                url: `/courses/${course.slug}`,
                level: course.level,
                closingDate: course.closingDate,
                programme: course.programme,
                duration: course.durationLabel || course.duration,
                priceLabel: course.priceLabel ?? (course.price > 0 ? `₦${Number(course.price).toLocaleString()}` : undefined),
              };
              return <ExploreCourseCard key={course._id} course={frontendCourse} />;
            })}
          </div>
        )}
      </div>

      <p className="mt-14 text-center text-[12px] text-[#8a8c95]">{CATALOG_VIDEO_CREDIT}</p>
    </div>
  );
};

// useSearchParams needs a Suspense boundary in the App Router
const CoursesPage = () => (
  <Suspense fallback={null}>
    <CoursesPageGate />
  </Suspense>
);

export default CoursesPage;
