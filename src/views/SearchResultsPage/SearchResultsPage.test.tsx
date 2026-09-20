import { cleanup, render, screen, within } from "@testing-library/react";
import SearchResultsPage from ".";
import { TServerSearchCourseItem } from "@utils/test/mocks/handlers/courses";
import { handleAssertLoadingState } from "@utils/test/assertUtils";
import createTestServer from "@utils/test/mocks/servers/createTestServer";
import { ERouteId } from "@constants/routes";
import handleUseRoute from "@utils/handleUseRoute";
import TestProviders from "@components/Providers/TestProvider";




describe("SearchResultsPage component", () => {
  test("Ensure the page reads the query string param from the URL", () => {
    render(
      <TestProviders memoryRouterProps={{ initialEntries: ["/?search=react"] }}>
        <SearchResultsPage />
      </TestProviders>
    );

    within(screen.getByTestId("search-results-heading")).getByText(
      /searching for react.../i
    );
    cleanup();

    render(
      <TestProviders memoryRouterProps={{ initialEntries: ["/?search=javascript"] }}>
        <SearchResultsPage />
      </TestProviders>
    );

    within(screen.getByTestId("search-results-heading")).getByText(
      /searching for javascript.../i
    );
  });
});

const COURSES_RESPONSE: TServerSearchCourseItem[] = [
  {
    id: 1,
    title: "Course 1",
    imageUrl: "https://picsum.photos/500/300?random=1",
    instructor: "Instructor 1",
    rating: 4.5,
    price: 10000,
    studentCount: 1000,
    description: "Course 1 description",
    ratingCount: 100,
    totalHours: 10,
    totalLectures: 10,
    level: "Beginner",
    discountedPrice: 5000,
  },
  {
    id: 2,
    title: "Course 2",
    imageUrl: "https://picsum.photos/500/300?random=2",
    instructor: "Instructor 2",
    rating: 3.5,
    price: 20000,
    studentCount: 2000,
    description: "Course 2 description",
    ratingCount: 200,
    totalHours: 20,
    totalLectures: 20,
    level: "Intermediate",
    discountedPrice: 10000,
  },
  {
    id: 3,
    title: "Course 3",
    imageUrl: "https://picsum.photos/500/300?random=3",
    instructor: "Instructor 3",
    rating: 4.0,
    price: 30000,
    studentCount: 3000,
    description: "Course 3 description",
    ratingCount: 300,
    totalHours: 30,
    totalLectures: 30,
    level: "Advanced",
    discountedPrice: 15000,
  },
  {
    id: 4,
    title: "Course 4",
    imageUrl: "https://picsum.photos/500/400?random=4",
    instructor: "Instructor 4",
    rating: 4.0,
    price: 40000,
    studentCount: 4000,
    description: "Course 4 description",
    ratingCount: 400,
    totalHours: 40,
    totalLectures: 40,
    level: "Beginner",
    discountedPrice: 20000,
  },
  {
    id: 5,
    title: "Course 5",
    imageUrl: "https://picsum.photos/500/400?random=5",
    instructor: "Instructor 5",
    rating: 4.5,
    price: 50000,
    studentCount: 5000,
    description: "Course 5 description",
    ratingCount: 500,
    totalHours: 50,
    totalLectures: 50,
    level: "Intermediate",
    discountedPrice: 25000,
  },
];

describe("SearchResultsPage component: SUCCESS", () => {
  createTestServer([
    {
      route: handleUseRoute(ERouteId["courses.search"], false),
      response: COURSES_RESPONSE,
    },
  ]);

  test("Ensure the fetch and renders", async () => {
    render(
      <TestProviders memoryRouterProps={{ initialEntries: ["/?search=react"] }}>
        <SearchResultsPage />
      </TestProviders>
    );

    const getWithinHeadingEl = () =>
      within(screen.getByTestId("search-results-heading"));

    expect(
      getWithinHeadingEl().getByText(/searching for react.../i)
    ).toBeInTheDocument();

    await handleAssertLoadingState("loading");
    expect(
      getWithinHeadingEl().queryByText(/searching for react.../i)
    ).not.toBeInTheDocument();
    expect(
      getWithinHeadingEl().getByText(/results for "react"/i)
    ).toBeInTheDocument();
    expect(
      getWithinHeadingEl().getByTestId("search-results-count")
    ).toHaveTextContent(`${COURSES_RESPONSE.length}`);

    const courseList_el = screen.getAllByTestId("course");
    expect(courseList_el).toHaveLength(COURSES_RESPONSE.length);

    expect(screen.queryByTestId("error")).not.toBeInTheDocument();
  });
});

describe("SearchResultsPage component: ERROR", () => {
  createTestServer([
    {
      route: handleUseRoute(ERouteId["courses.search"], false),
      isResponseError: true,
      response: {
        message: "Yah!",
      },
    },
  ]);

  test("Ensure the fetch and renders", async () => {
    render(
      <TestProviders memoryRouterProps={{ initialEntries: ["/?search=react"] }}>
        <SearchResultsPage />
      </TestProviders>
    );

    within(screen.getByTestId("search-results-heading")).getByText(
      /searching for react.../i
    );

    await handleAssertLoadingState("loading");

    const error_el = screen.getByTestId("error");
    expect(error_el).toBeInTheDocument();
    expect(error_el).toHaveTextContent("Yah!");

    expect(screen.queryByTestId("course")).not.toBeInTheDocument();
  });
});
