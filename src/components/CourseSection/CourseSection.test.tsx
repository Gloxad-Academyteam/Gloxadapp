import { render, screen, within } from "@testing-library/react";
import CourseSection from ".";
import createTestServer from "@utils/test/mocks/servers/createTestServer";
import handleUseRoute from "@utils/handleUseRoute";
import { ERouteId } from "@constants/routes";
import { handleAssertLoadingState } from "@utils/test/assertUtils";
import TestProviders from "@components/Providers/TestProvider";
import formatToCurrency from "@utils/formatToCurrency";

const COURSES_RESPONSE = [
  {
    id: 1,
    title: "Course Tester",
    instructor: "Instructor Tester",
    rating: 4.5,
    price: 10000,
    imageUrl: "https://picsum.photos/500/300?random=1",
    studentCount: 1000,
  },
  {
    id: 2,
    title: "Course Tester 2",
    instructor: "Instructor Tester 2",
    rating: 3.5,
    price: 20000,
    imageUrl: "https://picsum.photos/500/300?random=2",
    studentCount: 2000,
  },
];

describe("CourseSection component: Success -> isRecommendedCourses", () => {
  createTestServer([
    {
      route: handleUseRoute(ERouteId["courses.list"]),
      response: COURSES_RESPONSE,
    },
    {
      // NOTE: Seems RQ in test env tries to fetch this route even if the implementation sets `enable` (fetch) to false
      route: handleUseRoute(ERouteId["courses.because-you-viewed"]),
    },
  ]);

  test("Renders loading and then courses", async () => {
    render(<CourseSection heading="New Courses" isRecommendedCourses />, {
      wrapper: TestProviders,
    });

    await handleAssertLoadingState("loading");

    const courseList_el = await screen.findAllByTestId("course");
    expect(courseList_el).toHaveLength(COURSES_RESPONSE.length);

    COURSES_RESPONSE.forEach((course, index) => {
      const studentCountValue = course.studentCount.toLocaleString();
      const studentCount_el = screen.getAllByTestId("student-count")[index];
      expect(studentCount_el).toHaveTextContent(`(${studentCountValue})`);

      const priceValue = formatToCurrency(course.price);
      const price_el = screen.getAllByTestId("price")[index];
      expect(price_el).toHaveTextContent(priceValue);

      const imageUrl_el = screen.getByAltText(course.title);
      expect(imageUrl_el).toHaveAttribute("src", course.imageUrl);

      screen.getByText(course.title);
      screen.getByText(course.instructor);
      screen.getByText(course.rating.toString());
    });

    expect(screen.getByTestId("is-recommended-heading")).toBeInTheDocument();
    expect(
      within(screen.getByTestId("is-recommended-heading")).getByText(
        "New Courses"
      )
    ).toBeInTheDocument();
  });
});

describe("CourseSection component: Success -> isBecauseYouViewedCourses", () => {
  createTestServer([
    {
      route: handleUseRoute(ERouteId["courses.because-you-viewed"]),
      response: {
        courses: COURSES_RESPONSE,
        course: {
          title: "Cool Courser",
          id: 1001,
        },
      },
    },
  ]);

  test("Renders loading and then courses", async () => {
    render(<CourseSection heading="New Courses" isBecauseYouViewedCourses />, {
      wrapper: TestProviders,
    });

    const heading = screen.getByTestId("is-because-you-viewed-heading");
    expect(heading).toBeInTheDocument();

    expect(
      within(heading).queryByRole("link", { name: "Cool Courser" })
    ).not.toBeInTheDocument();
    expect(within(heading).getByText("Because you viewed")).toBeInTheDocument();
    expect(within(heading).getByText("Loading...")).toBeInTheDocument();
    await handleAssertLoadingState("loading");
    expect(within(heading).getByText("Because you viewed")).toBeInTheDocument();
    expect(within(heading).queryByText("Loading...")).not.toBeInTheDocument();
    expect(
      within(heading).getByRole("link", { name: "Cool Courser" })
    ).toHaveAttribute("href", "/courses/1001");

    const courseList_el = await screen.findAllByTestId("course");
    expect(courseList_el).toHaveLength(COURSES_RESPONSE.length);
  });
});

describe("CourseSection component: Error", () => {
  createTestServer([
    {
      route: handleUseRoute(ERouteId["courses.list"]),
      isResponseError: true,
    },
    {
      // NOTE: Seems RQ in test env tries to fetch this route even if the implementation sets `enable` (fetch) to false
      route: handleUseRoute(ERouteId["courses.because-you-viewed"]),
    },
  ]);

  test("Renders loading then error", async () => {
    render(<CourseSection isFeaturedCourses heading="Hot and Trending" />, {
      wrapper: TestProviders,
    });

    expect(screen.getByTestId("is-featured-heading")).toBeInTheDocument();
    expect(
      within(screen.getByTestId("is-featured-heading")).getByText(
        "Hot and Trending"
      )
    ).toBeInTheDocument();

    await handleAssertLoadingState("loading");

    await screen.findByText(/error/i);
  });
});
