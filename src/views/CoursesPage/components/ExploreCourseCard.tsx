import React from "react";
import CourseCard from "@components/CourseCard";

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

const ExploreCourseCard: React.FC<ExploreCourseCardProps> = ({ course }) => (
  <CourseCard
    href={course.url}
    title={course.title}
    image={course.imageUrl}
    provider="Gloxad Academy"
    tag={course.programme}
    meta={[levelLabel(course.level), course.duration, course.closingDate && `Enrollment closes ${course.closingDate}`]}
    priceLabel={course.priceLabel}
  />
);

export default ExploreCourseCard;
