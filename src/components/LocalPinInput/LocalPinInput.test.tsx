import { render, screen } from "@testing-library/react";
import LocalPinInput from ".";

describe("LocalPinInput component", () => {
  test("Ensures props are handled correctly", () => {
    const props = {
      length: 6,
      initialValue: "123456",
      onComplete: jest.fn(),
    };

    render(<LocalPinInput {...props} />);

    props.initialValue.split("").forEach((char) => {
      expect(screen.getByDisplayValue(char)).toBeInTheDocument();
    });

    expect(props.onComplete).toHaveBeenCalled();
    expect(props.onComplete).toHaveBeenCalledTimes(1);
    expect(props.onComplete).toHaveBeenCalledWith(props.initialValue);
  });
});
