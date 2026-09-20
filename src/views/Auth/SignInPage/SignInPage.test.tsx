import TestProviders from "@components/Providers/TestProvider";
import SignInPage from ".";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { handleAssertLoadingState } from "@utils/test/assertUtils";
import createTestServer from "@utils/test/mocks/servers/createTestServer";
import { signInServiceRoute } from "@services/auth";

const navigate = jest.fn();
jest.mock("react-router-dom", () => {
  return {
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => navigate,
  };
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("SignInPage: Success", () => {
  createTestServer([
    {
      route: signInServiceRoute,
      method: "post",
    },
  ]);

  test("Behaviour works as expected", async () => {
    render(<SignInPage />, {
      wrapper: TestProviders,
    });

    const user = userEvent.setup();

    const submitButton = screen.getByText(/log-in-submit/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.click(submitButton);

    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();

    await user.type(emailInput, "invalid-email");
    await user.click(submitButton);

    expect(
      screen.getByText(/email must be a valid email address/i)
    ).toBeInTheDocument();

    await user.type(emailInput, "me@email.com");
    await user.click(submitButton);

    expect(screen.getByText(/password is required/i)).toBeInTheDocument();

    await user.type(passwordInput, "password");
    await user.click(submitButton);

    expect(navigate).not.toHaveBeenCalled();

    await handleAssertLoadingState(submitButton);

    expect(screen.getByText(/login successful/i)).toBeInTheDocument();
    expect(navigate).toHaveBeenCalledWith("/");
  });
});

describe("SignInPage: Error", () => {
  createTestServer([
    {
      route: signInServiceRoute,
      method: "post",
      isResponseError: true,
    },
  ]);

  test("Behaviour works as expected", async () => {
    render(<SignInPage />, {
      wrapper: TestProviders,
    });

    const user = userEvent.setup();

    const submitButton = screen.getByText(/log-in-submit/i);

    await user.type(screen.getByLabelText(/email/i), "me@email.com");
    await user.type(screen.getByLabelText(/password/i), "password");

    await user.click(submitButton);

    expect(navigate).not.toHaveBeenCalled();
    await handleAssertLoadingState(submitButton);

    expect(screen.getByText(/login failed/i)).toBeInTheDocument();
    expect(navigate).not.toHaveBeenCalled();
  });
});

describe("SignInPage: 401 Error", () => {
  createTestServer([
    {
      route: signInServiceRoute,
      method: "post",
      isResponseError: true,
      responseOptions: {
        status: 401,
      },
    },
  ]);

  test("Behaviour works as expected", async () => {
    render(<SignInPage />, {
      wrapper: TestProviders,
    });

    const user = userEvent.setup();

    const submitButton = screen.getByText(/log-in-submit/i);

    await user.type(screen.getByLabelText(/email/i), "me@me.com");
    await user.type(screen.getByLabelText(/password/i), "password");

    await user.click(submitButton);
    await handleAssertLoadingState(submitButton);

    expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
    expect(navigate).not.toHaveBeenCalled();
  })
});
