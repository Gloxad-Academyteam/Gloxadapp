import TestProviders from "@components/Providers/TestProvider";
import PopularCourses from ".";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import createTestServer from "@utils/test/mocks/servers/createTestServer";

const navigate = jest.fn();
jest.mock("react-router-dom", () => {
  return {
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => navigate
  };
});

// Mock useAuth
const mockUseAuth = jest.fn();
jest.mock("@hooks/useAuth", () => {
  return () => mockUseAuth();
});

describe("PopularCourses Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({ isAuthenticated: false });
  });

  createTestServer([
    {
      route: "http://localhost:3000/api/courses",
      method: "get",
      response: {
        courses: [
          { _id: "1", title: "Course 1", price: 10, averageRating: 4.5, enrollmentCount: 200, slug: "course-1" },
          { _id: "2", title: "Course 2", price: 20, averageRating: 4.6, enrollmentCount: 190, slug: "course-2" }
        ],
        totalCourses: 10
      }
    }
  ]);

  test("Renders popular courses and View More button when totalCourses > 6", async () => {
    render(<PopularCourses />, {
      wrapper: TestProviders
    });

    const course1 = await screen.findByText("Course 1");
    expect(course1).toBeInTheDocument();
    expect(screen.getByText("Course 2")).toBeInTheDocument();

    const viewMoreButton = screen.getByText("View More Courses");
    expect(viewMoreButton).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(viewMoreButton);

    expect(navigate).toHaveBeenCalledWith("/auth/signin?redirect=/courses");
  });
});
