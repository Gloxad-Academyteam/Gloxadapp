// @ts-nocheck
import { render, screen } from "@testing-library/react";
import ReportModalContent from ".";
import userEvent from "@testing-library/user-event";
import { handleAssertLoadingState } from "@utils/test/assertUtils";
import SELECT_OPTIONS from "@constants/reports-options";
import TestProviders from "@components/Providers/TestProvider";
import createTestServer from "@utils/test/mocks/servers/createTestServer";
import { sendReportServiceRoute } from "@services/report";
import { consoleInfoSpy } from "@utils/test/mocks/spies/consoleSpy";
import { MODAL_CLOSED } from "@constants/modal-logs";

describe("ReportModalContent Success", () => {
  createTestServer([
    {
      route: sendReportServiceRoute,
      method: "post",
    },
  ]);

  test("Form works as expected", async () => {
    const handleCancelClick = jest.fn();
    render(<ReportModalContent onCancelClick={handleCancelClick} />, {
      wrapper: TestProviders,
    });
    const user = userEvent.setup();

    expect(handleCancelClick).not.toHaveBeenCalled();
    expect(consoleInfoSpy).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: /cancel/i }));
    expect(handleCancelClick).toHaveBeenCalled();
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      expect.stringContaining(MODAL_CLOSED)
    );
    expect(consoleInfoSpy).toHaveBeenCalledTimes(1);

    screen.getByLabelText("select");
    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(SELECT_OPTIONS.length);

    await user.selectOptions(
      screen.getByRole("combobox"),
      SELECT_OPTIONS[1].label
    );
    const textarea = screen.getByRole("textbox");

    const submitButton = screen.getByRole("button", { name: /submit/i });
    await user.click(submitButton);
    expect(consoleInfoSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/report message is required/i)).toBeInTheDocument();

    await user.type(textarea, "This is a report message");
    expect(textarea).toHaveValue("This is a report message");
    expect(
      screen.queryByText(/report message is required/i)
    ).not.toBeInTheDocument();

    await user.click(submitButton);

    expect(
      screen.queryByText(/report sent successfully/i)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/report failed! try again/i)
    ).not.toBeInTheDocument();

    await handleAssertLoadingState(submitButton);

    expect(screen.getByText(/report sent successfully/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/report failed! try again/i)
    ).not.toBeInTheDocument();
    expect(consoleInfoSpy).toHaveBeenCalledTimes(2);
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      expect.stringContaining(MODAL_CLOSED)
    );
  });
});

describe("ReportModalContent Error", () => {
  createTestServer([
    {
      route: sendReportServiceRoute,
      method: "post",
      isResponseError: true,
    },
  ]);

  test("Form works as expected", async () => {
    render(<ReportModalContent />, { wrapper: TestProviders });
    const user = userEvent.setup();

    await user.selectOptions(
      screen.getByRole("combobox"),
      SELECT_OPTIONS[1].label
    );
    await user.type(screen.getByRole("textbox"), "This is a report message");

    const submitButton = screen.getByRole("button", { name: /submit/i });
    await user.click(submitButton);

    expect(
      screen.queryByText(/report sent successfully/i)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/report failed! try again/i)
    ).not.toBeInTheDocument();

    await handleAssertLoadingState(submitButton);

    expect(
      screen.queryByText(/report sent successfully/i)
    ).not.toBeInTheDocument();
    expect(screen.getByText(/report failed! try again/i)).toBeInTheDocument();
  });
});
