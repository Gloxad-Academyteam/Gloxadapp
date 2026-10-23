import React from "react";
import Link from "next/link";

interface ExploreCourseCardProps {
  course: {
    id: string;
    title: string;
    description?: string;
    imageUrl: string;
    level?: string;
    closingDate?: string;
    url: string;
    // Programme type, duration and price, shown for catalog courses
    programme?: string;
    duration?: string;
    priceLabel?: string;
  };
}

const levelLabel = (level?: string) => {
  const value = (level || "").toLowerCase();
  if (value.startsWith("beginner")) return "Beginner Friendly";
  if (value.startsWith("advanced")) return "Advanced Level";
  if (value.startsWith("intermediate")) return "Intermediate Level";
  return null;
};

const ExploreCourseCard: React.FC<ExploreCourseCardProps> = ({ course }) => {
  const level = levelLabel(course.level);

  return (
    <article className="card-interactive group flex flex-col">
      <Link href={course.url} className="block overflow-hidden rounded-[10px] bg-[#f4f5f8]">
        <img
          src={course.imageUrl}
          alt={course.title}
          loading="lazy"
          // Missing thumbnails fall back to the site image rather than a broken-image icon
          onError={(event) => {
            if (!event.currentTarget.src.endsWith("/og-image.jpg")) event.currentTarget.src = "/og-image.jpg";
          }}
          className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col pt-4">
        {course.programme && (
          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.06em] text-[#3e92cc]">{course.programme}</p>
        )}
        <h3 className="line-clamp-2 text-[15px] font-bold leading-tight text-[#201633]">{course.title}</h3>

        <p className="mt-2 line-clamp-3 flex-1 text-[13px] leading-[1.55] text-[#6b6d76]">
          {course.description ||
            "Master the core concepts and practical skills. Learn the industry standard tools, frameworks, and best practices to advance your career."}
        </p>

        {course.closingDate && (
          <p className="mt-3 text-[12px] font-medium text-[#F97316]">Enrollment Closes: {course.closingDate}</p>
        )}
        {course.duration && <p className="mt-3 text-[12px] text-[#8a8c95]">{course.duration}</p>}
        {level && <p className="mt-1 text-[12px] text-[#8a8c95]">{level}</p>}
        {course.priceLabel && <p className="mt-2 text-[14px] font-bold text-[#201633]">{course.priceLabel}</p>}

        <Link
          href={course.url}
          className="btn-interactive mt-4 inline-flex h-[36px] w-max items-center rounded-full bg-[#07004d] px-6 text-[13px] font-medium text-white transition-colors hover:bg-[#111456]"
        >
          View Course
        </Link>
      </div>
    </article>
  );
};

export default ExploreCourseCard;
