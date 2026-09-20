import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Button from ".";
import ButtonSecondary from "./ButtonSecondary";

describe("Button component", () => {
  test("Dropdown variant works as expected", async () => {
    const user = userEvent.setup();

    const handleClick = jest.fn();

    render(<Button text="Hello" onClick={handleClick} />);
    expect(handleClick).toHaveBeenCalledTimes(0);

    await user.click(screen.getByText(/hello/i));
    expect(handleClick).toHaveBeenCalledTimes(1);

    await user.click(screen.getByText(/hello/i));
    await user.click(screen.getByText(/hello/i));
    expect(handleClick).toHaveBeenCalledTimes(3);

    expect(screen.getByText(/hello/i)).toBeInTheDocument();
    expect(screen.queryByTestId("dropdown-button")).not.toBeInTheDocument();

    cleanup();
    const handleOption2Click = jest.fn();
    render(
      <Button
        text="Hello"
        renderDropdown={() => (
          <div>
            <ul>
              <li>Option 1</li>
              <li onClick={handleOption2Click}>Option 2</li>
              <li>Option 3</li>
            </ul>
          </div>
        )}
      />
    );

    expect(screen.queryByTestId("dropdown-content")).not.toBeInTheDocument();

    await user.click(screen.getByTestId("dropdown-button"));
    expect(screen.getByTestId("dropdown-content")).toBeInTheDocument();

    await user.click(screen.getByTestId("dropdown-button"));
    expect(screen.queryByTestId("dropdown-content")).not.toBeInTheDocument();

    await user.click(screen.getByTestId("dropdown-button"));
    expect(screen.getByTestId("dropdown-content")).toBeInTheDocument();

    await user.click(screen.getByTestId("dropdown-content"));
    expect(screen.queryByTestId("dropdown-content")).not.toBeInTheDocument();
    expect(screen.queryByText(/option 1/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/option 2/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/option 3/i)).not.toBeInTheDocument();

    await user.click(screen.getByTestId("dropdown-button"));
    expect(screen.getByTestId("dropdown-content")).toBeInTheDocument();
    expect(screen.getByText(/option 1/i)).toBeInTheDocument();
    expect(screen.getByText(/option 2/i)).toBeInTheDocument();
    expect(screen.getByText(/option 3/i)).toBeInTheDocument();

    expect(handleOption2Click).toHaveBeenCalledTimes(0);
    await user.click(screen.getByText(/option 2/i));
    expect(handleOption2Click).toHaveBeenCalledTimes(1);
  });

  test("Renders content from prop", () => {
    render(<Button renderContent={() => <p>Hello</p>} />);
    expect(screen.getByText(/hello/i)).toBeInTheDocument();

    cleanup();
    render(<Button renderContent={() => <p>World</p>} />);
    expect(screen.getByText(/world/i)).toBeInTheDocument();
  });
});

describe("ButtonSecondary component", () => {
  test("Renders content from prop", () => {
    render(<ButtonSecondary renderContent={() => <p>Hello</p>} />);
    expect(screen.getByText(/hello/i)).toBeInTheDocument();

    cleanup();
    render(<ButtonSecondary renderContent={() => <p>World</p>} />);
    expect(screen.getByText(/world/i)).toBeInTheDocument();

    cleanup();
    render(
      <ButtonSecondary renderContent={() => <p>bye testing</p>} text="Hello" />
    );
    expect(screen.getByText(/bye testing/i)).toBeInTheDocument();
    expect(screen.queryByText(/hello/i)).not.toBeInTheDocument();
  });

  test("Dropdown variant works as expected", async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(<ButtonSecondary text="Hello" onClick={handleClick} />);
    expect(handleClick).toHaveBeenCalledTimes(0);

    await user.click(screen.getByText(/hello/i));
    expect(handleClick).toHaveBeenCalledTimes(1);

    await user.click(screen.getByText(/hello/i));
    await user.click(screen.getByText(/hello/i));
    expect(handleClick).toHaveBeenCalledTimes(3);

    expect(screen.getByText(/hello/i)).toBeInTheDocument();
    expect(screen.queryByTestId("dropdown-button")).not.toBeInTheDocument();

    cleanup();
    const handleOption2Click = jest.fn();
    render(
      <ButtonSecondary
        text="Hello"
        renderDropdown={() => (
          <div>
            <ul>
              <li>Option 1</li>
              <li onClick={handleOption2Click}>Option 2</li>
              <li>Option 3</li>
            </ul>
          </div>
        )}
      />
    );

    expect(screen.queryByTestId("dropdown-content")).not.toBeInTheDocument();
    expect(screen.queryByText(/option 1/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/option 2/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/option 3/i)).not.toBeInTheDocument();

    await user.click(screen.getByTestId("dropdown-button"));
    expect(screen.getByTestId("dropdown-content")).toBeInTheDocument();
    expect(screen.getByText(/option 1/i)).toBeInTheDocument();
    expect(screen.getByText(/option 2/i)).toBeInTheDocument();
    expect(screen.getByText(/option 3/i)).toBeInTheDocument();

    await user.hover(screen.getByTestId("dropdown-content"));
    expect(screen.getByTestId("dropdown-content")).toBeInTheDocument();

    await user.unhover(screen.getByTestId("dropdown-content"));
    expect(screen.queryByTestId("dropdown-content")).not.toBeInTheDocument();
  });

  test("Render content should be aware of the dropdown state", async () => {
    const user = userEvent.setup();

    render(
      <ButtonSecondary
        renderContent={({ isDisplayDropdown }) => {
          return isDisplayDropdown ? <p>Is open</p> : <p>Is closed</p>;
        }}
        renderDropdown={() => (
          <div>
            <ul>
              <li>Option 1</li>
              <li>Option 2</li>
              <li>Option 3</li>
            </ul>
          </div>
        )}
      />
    );
    expect(screen.getByText(/is closed/i)).toBeInTheDocument();
    
    await user.click(screen.getByTestId("dropdown-button"));
    expect(screen.getByText(/is open/i)).toBeInTheDocument();
    expect(screen.queryByText(/is closed/i)).not.toBeInTheDocument();

    await user.hover(screen.getByTestId("dropdown-content"));
    await user.unhover(screen.getByTestId("dropdown-content"));
    expect(screen.getByText(/is closed/i)).toBeInTheDocument();
    expect(screen.queryByText(/is open/i)).not.toBeInTheDocument();
  });
});
