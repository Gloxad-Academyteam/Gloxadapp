import TestProviders from "@components/Providers/TestProvider";
import SignUpPage from ".";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { handleAssertLoadingState } from "@utils/test/assertUtils";
import createTestServer from "@utils/test/mocks/servers/createTestServer";
import { signUpServiceRoute } from "@services/auth";

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

describe("SignUpPage: Success", () => {
  createTestServer([
    {
      route: signUpServiceRoute,
      method: "post",
    },
  ]);

  test("Behaviour works as expected", async () => {
    render(<SignUpPage />, {
      wrapper: TestProviders,
    });

    const user = userEvent.setup();

    const submitButton = screen.getByText(/sign-up-submit/i);
    const fullNameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/passcode/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

    await user.click(submitButton);

    expect(screen.getByText(/full name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/passcode is required/i)).toBeInTheDocument();
    expect(
      screen.getByText(/confirm password is required/i)
    ).toBeInTheDocument();

    await user.type(fullNameInput, "John Doe");

    await user.type(emailInput, "invalid-email");
    await user.click(submitButton);
    expect(
      screen.getByText(/email must be a valid email address/i)
    ).toBeInTheDocument();
    await user.type(emailInput, "me@email.com");
    await user.click(submitButton);

    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    expect(
      screen.getByText(/confirm password is required/i)
    ).toBeInTheDocument();

    await user.type(passwordInput, "password");
    expect(screen.getByText(/passwords must match/i)).toBeInTheDocument();
    await user.type(confirmPasswordInput, "password");
    expect(screen.queryByText(/passwords must match/i)).not.toBeInTheDocument();

    await user.click(submitButton);
    expect(navigate).not.toHaveBeenCalled();
    await handleAssertLoadingState(submitButton);
    expect(screen.getByText(/sign-up successful/i)).toBeInTheDocument();
    expect(navigate).toHaveBeenCalledWith("/auth/signin");
  });
});

describe("SignUpPage: Error", () => {
  createTestServer([
    {
      route: signUpServiceRoute,
      method: "post",
      isResponseError: true,
    },
  ]);

  test("Behaviour works as expected", async () => {
    render(<SignUpPage />, {
      wrapper: TestProviders,
    });

    const user = userEvent.setup();

    const submitButton = screen.getByText(/sign-up-submit/i);

    await user.type(screen.getByLabelText(/full name/i), "John Doe");
    await user.type(screen.getByLabelText(/email/i), "me@email.com");
    await user.type(screen.getByLabelText(/passcode/i), "password");
    await user.type(screen.getByLabelText(/confirm password/i), "password");

    await user.click(submitButton);

    expect(navigate).not.toHaveBeenCalled();
    await handleAssertLoadingState(submitButton);
    expect(screen.getByText(/sign-up failed/i)).toBeInTheDocument();
    expect(navigate).not.toHaveBeenCalled();
  });
});
