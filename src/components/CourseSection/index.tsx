import CourseBox from "@components/CourseItem/CourseItemBox";
import { PADDING_X } from "@constants/homepage";
import useCourseSection from "./hooks/useCourseSection";
import TextLink from "@components/TextLink";

type TCourseSection = {
  heading?: string;
  renderHeading?: () => JSX.Element;
  isRecommendedCourses?: boolean;
  isFeaturedCourses?: boolean;
  isBecauseYouViewedCourses?: boolean;
};

const CourseSection = ({
  heading,
  isRecommendedCourses,
  isFeaturedCourses,
  isBecauseYouViewedCourses,
}: TCourseSection) => {
  const { courses, error, courseHeading, testId } = useCourseSection({
    isRecommendedCourses,
    isFeaturedCourses,
    isBecauseYouViewedCourses,
  });

  const handleRenderHeading = () => {
    if (courseHeading !== null) {
      return (
        <h2 className="font-medium text-headline-large mb-[20px] flex items-center gap-[8px]" data-testid={testId}>
           {courseHeading.text}
            <TextLink text={courseHeading.courseTitle || ""} to={`/courses/${courseHeading.courseId}`} />
        </h2>
      );
    }

    if (heading) {
      return (
        <h2 className="font-medium text-headline-large mb-[20px]"
        data-testid={testId}
        >{heading}</h2>
      );
    }

    return null;
  };

  return (
    <section>
      {handleRenderHeading()}


      {Array.isArray(courses) && courses.length > 0 && (
        <div
          className="flex gap-[16px] overflow-x-auto"
          style={{ width: `calc(100vw - (${PADDING_X} * 2))` }}
        >
          {courses.map((course) => (
            <div key={course.id} data-testid="course">
              <CourseBox course={{ ...course, url: `/courses/${course.id}` }} />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="p-4 text-red-500 bg-white rounded-lg shadow-md">
          Error: {error}
        </div>
      )}
    </section>
  );
};

export default CourseSection;
