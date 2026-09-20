import React from "react";
import Link from "next/link";

interface ExploreCourseCardProps {
  course: {
    id: string;
    title: string;
    description?: string;
    imageUrl: string;
    level: string;
    closingDate?: string;
    url: string;
  };
}

const ExploreCourseCard: React.FC<ExploreCourseCardProps> = ({ course }) => {
  return (
    <article className="card-interactive group flex flex-col">
      <div className="overflow-hidden rounded-[10px] bg-[#f4f5f8]">
        <img
          src={course.imageUrl}
          alt={course.title}
          className="h-[180px] w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-[190px]"
        />
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <h3 className="line-clamp-2 text-[15px] font-bold leading-tight text-[#201633]">{course.title}</h3>

        <p className="mt-2 line-clamp-3 flex-1 text-[13px] leading-[1.55] text-[#6b6d76]">
          {course.description ||
            "Master the core concepts and practical skills. Learn the industry standard tools, frameworks, and best practices to advance your career."}
        </p>

        <p className="mt-3 text-[12px] font-medium text-[#F97316]">
          Enrollment Closes: {course.closingDate || "March 15, 2025"}
        </p>
        <p className="mt-1 text-[12px] text-[#8a8c95]">
          {course.level === "Beginner" ? "Beginner Friendly" : course.level === "Advanced" ? "Advanced Level" : "Intermediate Level"}
        </p>

        <Link
          href={course.url}
          className="btn-interactive mt-4 inline-flex h-[36px] w-max items-center rounded-full bg-[#07004d] px-6 text-[13px] font-medium text-white transition-colors hover:bg-[#111456]"
        >
          Enroll Now
        </Link>
      </div>
    </article>
  );
};

export default ExploreCourseCard;
