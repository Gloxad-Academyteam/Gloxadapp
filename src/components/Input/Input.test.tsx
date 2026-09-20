import { cleanup, render, screen } from "@testing-library/react";
import Input from ".";
import { FaCircleExclamation } from "react-icons/fa6";
import userEvent from "@testing-library/user-event";

describe("Input component", () => {
  test("Renders Error Icon appropriately", () => {
    render(<Input value="hey" showErrorIcon error="Error" />);
    expect(screen.getByTestId("error-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("right-icon")).not.toBeInTheDocument();

    cleanup();
    render(
      <Input value="hey" showErrorIcon error="Error" RightIcon={FaCircleExclamation} />
    );
    expect(screen.getByTestId("error-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("right-icon")).not.toBeInTheDocument();

    cleanup();
    render(<Input value="hey" error="Error" RightIcon={FaCircleExclamation} />);
    expect(screen.getByTestId("error-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("right-icon")).not.toBeInTheDocument();

    cleanup();
    render(<Input value="hey" error="Invalid Field" />);
    expect(screen.getByTestId("error-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("right-icon")).not.toBeInTheDocument();
    expect(screen.getByText(/invalid field/i)).toBeInTheDocument();
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();

    cleanup();
    render(
      <Input value="hey"
        showErrorIcon={false}
        error="Error"
        RightIcon={FaCircleExclamation}
      />
    );
    expect(screen.getByTestId("right-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("error-icon")).not.toBeInTheDocument();
    expect(screen.getByText(/error/i)).toBeInTheDocument();
    expect(screen.queryByText(/invalid field/i)).not.toBeInTheDocument();

    cleanup();
    render(<Input value="hey" RightIcon={FaCircleExclamation} />);
    expect(screen.getByTestId("right-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("error-icon")).not.toBeInTheDocument();
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();

    cleanup();
    render(<Input value="hey" />);
    expect(screen.queryByTestId("right-icon")).not.toBeInTheDocument();
    expect(screen.queryByTestId("error-icon")).not.toBeInTheDocument();
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
  });

  test("Renders right icon from render props", () => {
    render(<Input value="hey" renderRightIcon={() => <FaCircleExclamation />} />);
    expect(screen.getByTestId("right-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("error-icon")).not.toBeInTheDocument();

    cleanup();
    render(<Input value="hey" renderRightIcon={() => <FaCircleExclamation />} error="Error" />);
    expect(screen.getByTestId("right-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("error-icon")).not.toBeInTheDocument();

    cleanup();
    render(<Input value="hey" renderRightIcon={() => <FaCircleExclamation />} error="Error" showErrorIcon />);
    expect(screen.getByTestId("right-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("error-icon")).not.toBeInTheDocument();
  });

  test("Ensures the component is controlled", async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();

    render(<Input value="hey" onChange={handleChange} />);
    const input = screen.getByDisplayValue("hey");
    expect(handleChange).not.toHaveBeenCalled();

    await user.type(input, "hello");
    expect(handleChange).toHaveBeenCalled();
    expect(handleChange).toHaveBeenCalledTimes(5);
  });
});
