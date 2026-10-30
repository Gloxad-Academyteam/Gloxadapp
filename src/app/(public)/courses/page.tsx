import CoursesPage from "@pages/CoursesPage";
import OnlyWithTutorCourses from "@components/OnlyWithTutorCourses";

export default function Page() {
  return (
    <OnlyWithTutorCourses fallback="/free">
      <CoursesPage />
    </OnlyWithTutorCourses>
  );
}
