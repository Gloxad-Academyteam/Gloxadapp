import React from "react";
import Link from "next/link";
import { catalogCourses } from "@services/catalog";

type TProps = { course: any };

// Other courses from our own catalogue in the same category (never another institution's)
const CourseRecommendations = ({ course }: TProps) => {
  const related = catalogCourses
    .filter((item) => item.category === course?.category && item.slug !== course?.slug)
    .slice(0, 4);

  if (related.length === 0) return null;

  return (
    <div className="w-full mt-16 max-w-[1100px]">
      <h2 className="text-[24px] font-bold text-[#202127] mb-6">More in {course.category}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {related.map((item) => (
          <Link
            key={item.slug}
            href={`/courses/${item.slug}`}
            className="flex flex-col border border-[#e2e8f0] rounded-[12px] bg-white overflow-hidden hover:-translate-y-1 hover:shadow-md transition h-full"
          >
            <div className="h-[140px] w-full overflow-hidden p-2">
              <img src={item.thumbnail} alt={item.title} loading="lazy" className="w-full h-full object-cover rounded-[8px]" />
            </div>

            <div className="p-4 flex flex-col flex-1">
              <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#3e92cc] mb-1">{item.programme}</p>
              <h3 className="text-[15px] font-bold text-[#202127] leading-[1.3] mb-4 line-clamp-3">{item.title}</h3>
              <div className="mt-auto">
                <span className="text-[12px] text-[#717480]">{item.videos.length} video lessons · {item.videoHours} hours</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <Link href={`/courses?category=${encodeURIComponent(course.category.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""))}`} className="inline-block border border-[#0a1b56] text-[#0a1b56] font-bold text-[14px] px-6 py-2 rounded-[4px] hover:bg-gray-50 transition">
          Browse all {course.category} courses
        </Link>
      </div>
    </div>
  );
};

export default CourseRecommendations;
