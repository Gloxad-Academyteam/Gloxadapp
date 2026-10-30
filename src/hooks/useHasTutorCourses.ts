import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@utils/axiosInstance";
import { catalogCourses } from "@services/catalog";

const catalogTitles = new Set(catalogCourses.map((course) => course.title.toLowerCase()));

// "Our Courses" lists courses made by tutors. Until a tutor has published one, the site shows only the free courses.
// The free catalogue courses are imported by the platform, so a tutor's course is any course whose title isn't one of them.
export const useHasTutorCourses = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["has-tutor-courses"],
    queryFn: async () => {
      try {
        for (let page = 1; page <= 6; page++) {
          const { data } = await axiosInstance.get("/courses", { timeout: 8000, params: { limit: 50, page } });
          const list: any[] = Array.isArray(data) ? data : data?.courses ?? data?.data ?? [];
          if (list.some((course) => !catalogTitles.has(String(course.title).toLowerCase()))) return true;
          if (!data?.pagination?.hasNextPage) break;
        }
        return false;
      } catch {
        return false;
      }
    },
    staleTime: 5 * 60_000,
  });
  return { hasTutorCourses: data === true, isLoading };
};
