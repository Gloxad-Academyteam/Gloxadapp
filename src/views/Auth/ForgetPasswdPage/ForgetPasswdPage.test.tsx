import TestProviders from "@components/Providers/TestProvider";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import createTestServer from "@utils/test/mocks/servers/createTestServer";
import { forgetPasswdServiceRoute } from "@services/auth";
import ForgetPasswordPage from ".";
import { handleAssertLoadingState } from "@utils/test/assertUtils";

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
      route: forgetPasswdServiceRoute,
      method: "post",
    },
  ]);

  test("Behaviour works as expected", async () => {
    render(<ForgetPasswordPage />, {
      wrapper: TestProviders,
    });

    const event = userEvent.setup();
    const emailInput = screen.getByRole("textbox");
    expect(emailInput).toBeInTheDocument();
    const button = screen.getByRole("button");
    await event.click(button);
    let err = screen.getByText(/email is required/i);
    expect(navigate).not.toHaveBeenCalled();
    expect(err).toBeInTheDocument();

    await event.type(emailInput, "rubbish");
    await event.click(button);
    err = await screen.findByText(/email must be a valid email address/i);
    expect(navigate).not.toHaveBeenCalled();
    expect(err).toBeInTheDocument();

    await event.type(emailInput, "tester@gmail.com");
    await event.click(button);
    await handleAssertLoadingState(button);
    let res = await screen.findByText(/email sent successfully/i);
    expect(res).toBeInTheDocument();
    expect(navigate).toHaveBeenCalledWith("/");
  });
});

describe("SignInPage: Error", () => {
  createTestServer([
    {
      route: forgetPasswdServiceRoute,
      method: "post",
      isResponseError: true,
    },
  ]);

  test("Behaviour works as expected", async () => {
    render(<ForgetPasswordPage />, {
      wrapper: TestProviders,
    });

    const user = userEvent.setup();
    const button = screen.getByRole("button");
    const emailInput = screen.getByRole("textbox");
    expect(emailInput).toBeInTheDocument();
    await user.type(emailInput, "tester@gmail.com");
    await user.click(button);
    let err = await screen.findByText(/login failed! try again later/i);
    expect(err).toBeInTheDocument();
    expect(navigate).not.toHaveBeenCalled();
  });
});
