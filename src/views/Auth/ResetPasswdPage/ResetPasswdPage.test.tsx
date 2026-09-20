import TestProviders from "@components/Providers/TestProvider";
import ResetPasswdPage from ".";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { handleAssertLoadingState } from "@utils/test/assertUtils";
import createTestServer from "@utils/test/mocks/servers/createTestServer";
import { resetPasswdServiceRoute } from "@services/auth";

const navigate = jest.fn();

let query: Record<string, string> = {
  email: "tester@gmail.com",
  otp: "1234",
};

const search = (attr: string) => query[attr];
jest.mock("react-router-dom", () => {
  return {
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => navigate,
    useSearchParams: () => [{ get: (attr: string) => search(attr) }],
  };
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("ResetPasswdPage: Success", () => {
  createTestServer([
    {
      route: resetPasswdServiceRoute,
      method: "post",
    },
  ]);

  test("Behaviour works as expected", async () => {
    render(<ResetPasswdPage />, {
      wrapper: TestProviders,
    });

    const user = userEvent.setup();

    const submitButton = screen.getByText(/sign-up-submit/i);
    const passwordInput = screen.getByLabelText(/passcode/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

    await user.click(submitButton);

    expect(screen.getByText(/passcode is required/i)).toBeInTheDocument();
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
    expect(
      screen.getByText(/reset password successfully/i)
    ).toBeInTheDocument();
    expect(navigate).toHaveBeenCalledWith("/auth/signin");

    const mail = screen.getByTestId(/mail/i);
    expect(mail.textContent).toMatch(
      /please enter a new password from t[*]+@gmail.com/i
    );

    query.otp.split("").forEach((char) => {
      expect(screen.getByDisplayValue(char)).toBeInTheDocument();
    });
    expect(screen.getByTestId(/otp/i)).toBeInTheDocument();
  });

  test("expect no email or otp in the document", () => {
    query = {};
    render(<ResetPasswdPage />, {
      wrapper: TestProviders,
    });

    within(screen.getByTestId("mail")).getByText(
      /invalid url! no email or otp found. please get the url from your email again./i
    );
    expect(screen.queryByTestId(/otp/i)).not.toBeInTheDocument();
    cleanup();

    query = {
      email: "tester@gmail.com",
    };
    render(<ResetPasswdPage />, {
      wrapper: TestProviders,
    });

    within(screen.getByTestId("mail")).getByText(
      /invalid url! no email or otp found. please get the url from your email again./i
    );
    expect(screen.queryByTestId(/otp/i)).not.toBeInTheDocument();
    cleanup();

    query = {
      otp: "1234",
    };
    render(<ResetPasswdPage />, {
      wrapper: TestProviders,
    });

    within(screen.getByTestId("mail")).getByText(
      /invalid url! no email or otp found. please get the url from your email again./i
    );
    expect(screen.queryByTestId(/otp/i)).not.toBeInTheDocument();
    cleanup();

    query = {
      email: "whaler@gmail.com",
      otp: "4321",
    };
    render(<ResetPasswdPage />, {
      wrapper: TestProviders,
    });

    within(screen.getByTestId("mail")).getByText(
      /please enter a new password from w[*]+@gmail.com/i
    );
    expect(screen.getByTestId(/otp/i)).toBeInTheDocument();

    "4321".split("").forEach((char) => {
      expect(screen.getByDisplayValue(char)).toBeInTheDocument();
    });
  });
});

describe("ResetPasswdPage: Error", () => {
  query = {
    email: "tester@gmail.com",
    otp: "1234",
  };
  createTestServer([
    {
      route: resetPasswdServiceRoute,
      method: "post",
      isResponseError: true,
    },
  ]);

  test("Behaviour works as expected", async () => {
    render(<ResetPasswdPage />, {
      wrapper: TestProviders,
    });

    const user = userEvent.setup();

    const submitButton = screen.getByText(/sign-up-submit/i);

    await user.type(screen.getByLabelText(/passcode/i), "password");
    await user.type(screen.getByLabelText(/confirm password/i), "password");

    await user.click(submitButton);

    expect(navigate).not.toHaveBeenCalled();
    await handleAssertLoadingState(submitButton);
    expect(screen.getByText(/reset password failed/i)).toBeInTheDocument();
    expect(navigate).not.toHaveBeenCalled();
  });
});
