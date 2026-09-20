import { useQuery } from "@tanstack/react-query";
import { getMyEnrollments } from "@services/enrollments";

export const useDashboardPage = () => {
  const { data: enrollments, isLoading, error } = useQuery({
    queryKey: ["my-courses"],
    queryFn: getMyEnrollments,
  });

  const courses = enrollments?.map((enrollment: any) => ({
    id: enrollment.course._id,
    title: enrollment.course.title,
    instructor: `${enrollment.course.instructor.firstName} ${enrollment.course.instructor.lastName}`,
    rating: 4.5, // Hardcoded default for now
    price: enrollment.course.price,
    imageUrl: enrollment.course.thumbnailUrl || "https://via.placeholder.com/400x230",
    studentCount: 100, // Hardcoded default
    url: `/courses/${enrollment.course.slug}`,
    level: enrollment.course.level,
    duration: enrollment.course.duration,
    skills: enrollment.course.skills,
  })) || [];

  return { courses, isLoading, error };
};
