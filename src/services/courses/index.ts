import TService from "@types_/service";
import { TCourseItem, TUISearchCourseItem } from "./types";
import axiosInstance from "@utils/axiosInstance";
import handleUseRoute from "@utils/handleUseRoute";
import { ERouteId } from "@constants/routes";


async function getRecommendedCourses(): Promise<TService<TCourseItem[]>> {
  const response = await axiosInstance.get(
    handleUseRoute(ERouteId["courses.list"], false),
    {
      params: {
        recommended: true,
      },
    }
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: TCourseItem[] = (response.data.courses || []).map((item: any) => {
    const course: TCourseItem = {
      id: item.id,
      title: item.title,
      instructor: item.instructor,
      rating: item.rating,
      price: item.price,
      imageUrl: item.imageUrl,
      studentCount: item.studentCount,
      discountedPrice: item.discountedPrice,
    };

    return course;
  });

  return { data };
}

async function getBecauseYouViewedCourses(): Promise<
  TService<{
    courses: TCourseItem[];
    course: {
      title: string;
      id?: number;
    };
  }>
> {
  const response = await axiosInstance.get(
    handleUseRoute(ERouteId["courses.because-you-viewed"], false),
    {
      params: {
        becauseYouViewed: true,
      },
    }
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const courses: TCourseItem[] = (response.data?.courses || []).map((item: any) => {
    const course: TCourseItem = {
      id: item.id,
      title: item.title,
      instructor: item.instructor,
      rating: item.rating,
      price: item.price,
      imageUrl: item.imageUrl,
      studentCount: item.studentCount,
      discountedPrice: item.discountedPrice,
    };

    return course;
  });

  return {
    data: {
      courses,
      course: {
        title: response.data?.course?.title,
        id: response.data?.course?.id,
      },
    },
  };
}

async function getFeaturedCourses(): Promise<TService<TCourseItem[]>> {
  const response = await axiosInstance.get(
    handleUseRoute(ERouteId["courses.list"], false),
    {
      params: {
        featured: true,
      },
    }
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: TCourseItem[] = (response.data.courses || []).map((item: any) => {
    const course: TCourseItem = {
      id: item.id,
      title: item.title,
      instructor: item.instructor,
      rating: item.rating,
      price: item.price,
      imageUrl: item.imageUrl,
      studentCount: item.studentCount,
      discountedPrice: item.discountedPrice,
    };

    return course;
  });

  return { data };
}

const getSearchResults = async ({
  search,
  page = "1",
  rating,
  language,
}: {
  search: string;
  page: string;
  rating?: string;
  language?: string;
}): Promise<TService<{
  courses: TUISearchCourseItem[];
  totalPages: string;
}>> => {
  const response = await axiosInstance.get(
    handleUseRoute(ERouteId["courses.search"], false),
    {
      params: {
        search,
        page,
        rating,
        language,
        limit: 10,
      },
    }
  );

  const courses: TUISearchCourseItem[] = (response.data.courses || []).map(
    (item: any) => {
      const course: TUISearchCourseItem = {
        id: item.id,
        title: item.title,
        instructor: item.instructor,
        rating: item.rating,
        price: item.price,
        imageUrl: item.imageUrl,
        studentCount: item.studentCount,
        discountedPrice: item.discountedPrice,
        description: item.description,
        ratingCount: item.ratingCount,
        totalHours: item.totalHours,
        totalLectures: item.totalLectures,
        level: item.level,
      };

      return course;
    }
  );

  const data = {
    courses,
    totalPages: response.data.totalPages?.toString() || "1",
  };

  return { data };
};

export {
  getRecommendedCourses,
  getBecauseYouViewedCourses,
  getFeaturedCourses,
  getSearchResults,
};
