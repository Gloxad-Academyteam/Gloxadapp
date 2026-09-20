import {
  getBecauseYouViewedCourses,
  getFeaturedCourses,
  getRecommendedCourses,
} from "@services/courses";
import { useQuery } from "@tanstack/react-query";

const useCourseSection = ({
  isRecommendedCourses,
  isFeaturedCourses,
  isBecauseYouViewedCourses,
}: {
  isRecommendedCourses?: boolean;
  isFeaturedCourses?: boolean;
  isBecauseYouViewedCourses?: boolean;
} = {}) => {
  const getService = () => {
    if (isRecommendedCourses) {
      return {
        service: getRecommendedCourses,
        queryKey: ["recommended-courses"],
      };
    }

    if (isFeaturedCourses) {
      return {
        service: getFeaturedCourses,
        queryKey: ["featured-courses"],
      };
    }
  }

  const query = useQuery({
    queryKey: getService()?.queryKey as string[],
    queryFn: getService()?.service,
    enabled: !isBecauseYouViewedCourses
  });

  const becauseYouViewedQuery
  = useQuery({
    queryKey: ["because-you-viewed-courses"],
    queryFn: getBecauseYouViewedCourses,
    enabled: isBecauseYouViewedCourses
  });

  const courses = (() => {
    if (isBecauseYouViewedCourses) {
      return becauseYouViewedQuery.data?.data?.courses;
    }

    return query.data?.data;
  })();
  const courseHeading = (() => {
    if (isBecauseYouViewedCourses) {
      return {
        text: "Because you viewed",
        testId: "is-because-you-viewed-heading",
        courseTitle: becauseYouViewedQuery.data?.data?.course?.title,
        courseId: becauseYouViewedQuery.data?.data?.course?.id,
      };
    }

    return null;
  })();

  const loading = (() => {
    if (isBecauseYouViewedCourses) {
      return becauseYouViewedQuery.isLoading;
    }

    return query.isLoading;
  })();

  const error = (() => {
    if (isBecauseYouViewedCourses) {
      return becauseYouViewedQuery.error?.message;
    }

    return query.error?.message;
  })();

  const testId = (() => {
    if (isBecauseYouViewedCourses) {
      return "is-because-you-viewed-heading";
    }

    if (isRecommendedCourses) {
      return "is-recommended-heading";
    }

    if (isFeaturedCourses) {
      return "is-featured-heading";
    }
  })();

  return {
    courses,
    courseHeading,
    testId,
    loading,
    error,
  };
};


export default useCourseSection;
