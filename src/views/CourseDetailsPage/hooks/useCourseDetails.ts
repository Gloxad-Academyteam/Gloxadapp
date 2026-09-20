import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@utils/axiosInstance";

export const getCourseDetails = async (slug: string) => {
  const response = await axiosInstance.get(`/courses/${slug}`);
  return response.data;
};

export const useCourseDetails = (slug: string) => {
  return useQuery({
    queryKey: ["course-details", slug],
    queryFn: () => getCourseDetails(slug),
    enabled: !!slug,
  });
};
