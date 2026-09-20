import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PasswordInput from "./PasswordInput";

describe("PasswordInput component", () => {
  test("Ensures the toggle hide/show password button works", async () => {
  const handleChange = jest.fn();
    render(<PasswordInput value="hello" onChange={handleChange} />);
    const user = userEvent.setup();
    
    expect(screen.getByDisplayValue("hello")).toBeInTheDocument();
    expect(handleChange).not.toHaveBeenCalled();
    await user.type(screen.getByDisplayValue("hello"), "w");
    expect(handleChange).toHaveBeenCalledTimes(1);


    const toggleButtonWrapper = screen.getByTestId("toggle-button");
    const input = screen.getByLabelText(/input/i);

    const toggleButton = within(toggleButtonWrapper).getByRole("button");

    expect(input).toHaveAttribute("type", "password");
    await user.click(toggleButton);
    expect(input).toHaveAttribute("type", "text");
    await user.click(toggleButton);
    expect(input).toHaveAttribute("type", "password");
    
  });
});
