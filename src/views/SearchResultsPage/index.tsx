"use client";

import useSearchResultsPage from "./hooks/useSearchResultsPage";
import CourseList from "@components/CourseItem/CourseItemList";
import CourseBox from "@components/CourseItem/CourseItemBox";
import Button from "@components/Button";
import { FaFilter } from "react-icons/fa6";
import PaginationNavigator from "@components/PaginationNavigator";
import FilterBy from "./components/FilterBy";
import { useDashboardPage } from "@pages/DashboardPage/hooks/useDashboardPage";
import { CourseCardSkeleton } from "@components/Skeleton";

const SearchResultsPage = () => {
  const { searchQuery, isLoading, courses, isError, error, totalPages } = useSearchResultsPage();
  const { courses: enrolledCourses } = useDashboardPage();
  
  const enrolledCourseIds = new Set(enrolledCourses.map((c: any) => c.id));

  return (
    <div className="py-[80px] max-w-[1440px] mx-auto px-[20px] md:px-[40px] lg:px-[80px]">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-[20px]">
        <h1
          data-testid="search-results-heading"
          className="md:mb-[50px] font-medium md:font-bold text-headline-small md:text-display-small"
        >
          {courses ? (
            <>
              <span data-testid="search-results-count">{courses.length}</span>
              &nbsp; results for "{searchQuery}"
            </>
          ) : (
            `Searching for ${searchQuery}...`
          )}
        </h1>

        {courses && (
          <p className="hidden font-medium text-body-large md:block">
            {courses.length} results
          </p>
        )}

        <div className="md:hidden mb-[20px]">
          <div className="w-[50%]">
            <Button
              key="button-link"
              outline
              text="Filter"
              Icon={FaFilter}
              renderDropdown={() => (
                <div className="w-[250px] h-[70vh] max-h-[600px] border-[1px] border-neutral-4 p-4 bg-primary-1 overflow-y-auto">
                  <FilterBy />
                </div>
              )}
              dropdownIsSolid
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-[20px]">
        <div className="border-[1px] border-neutral-4 p-4 col-span-1 hidden md:block">
          <div className="sticky top-[15px] border-[1px] border-neutral-4 p-4 flex flex-col gap-[20px]">
            <p className="font-medium text-title-large">Filter By</p>

            <FilterBy />
          </div>
        </div>

        {isLoading && (
          <div
            data-testid="loading"
            className="md:col-span-3 col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <CourseCardSkeleton />
            <CourseCardSkeleton />
            <CourseCardSkeleton />
            <CourseCardSkeleton />
            <CourseCardSkeleton />
            <CourseCardSkeleton />
          </div>
        )}

        {isError && (
          <div
            data-testid="error"
            className="border-[1px] border-error-source p-4 md:col-span-3 col-span-4"
          >
            <p>{error}</p>
          </div>
        )}

        {courses && (
          <div className="md:border-[1px] border-neutral-4 p-4 gap-[30px] col-span-4 md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 place-items-center sm:place-items-stretch">
            {courses.map((course) => {
              const newCourse = {
                ...course,
                url: `/courses/${course.id}`,
                originalPrice: course.price,
              };
              const isEnrolled = enrolledCourseIds.has(course.id);
              return (
                <div key={course.id} data-testid="course">
                  <div className="lg:hidden">
                    <CourseBox course={newCourse} key={course.id} isEnrolled={isEnrolled} />
                  </div>

                  <div className="hidden lg:block">
                    <CourseList course={newCourse} key={course.id} isEnrolled={isEnrolled} />
                  </div>
                </div>
              );
            })}


         
          {totalPages && parseInt(totalPages, 10) > 1 && (
            <PaginationNavigator totalPages={parseInt(totalPages, 10)} className="sm:max-w-[730ppx] sm:overflow-x-auto sm:col-span-2 lg:col-span-1 h-[fit-content] self-start" />
          )}
          </div>
        )}
      </div>
    </div>
  );
};





export default SearchResultsPage;
