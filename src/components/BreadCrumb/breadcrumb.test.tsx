import { render, screen } from "@testing-library/react";
import BreadCrumb from "./BreadCrumb";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";

const navigate = jest.fn();
jest.mock("react-router-dom", () => {
  return {
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => navigate,
  };
});

const mockWindowLocationObject = (pathname: string) => {
  Object.defineProperty(window, "location", {
    value: {
      ...window.location,
      pathname: pathname as string,
    },
    writable: true,
  });
  return pathname;
};

describe("BreadCrumb ", () => {
  test("expect breadcrumb  to have length and navigate on click", async () => {
    mockWindowLocationObject("/etc/passwd");
    render(<BreadCrumb />, { wrapper: MemoryRouter });
    const linkEvent = userEvent.setup();
    const item = await screen.findAllByTestId(/path-container/i);
    const links = await screen.findAllByTestId(/link/i);
    expect(links).toHaveLength(2);
    expect(item).toHaveLength(3);
    expect(item[0]).toHaveTextContent("Home");
    expect(item[1]).toHaveTextContent("Etc");
    expect(item[2]).toHaveTextContent("Passwd");
    expect(navigate).not.toHaveBeenCalled();
    await linkEvent.click(links[1]);
    expect(navigate).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith("/etc/passwd");
  });

  test("removes the query string", async () => {
    mockWindowLocationObject("/etc/passwd?user=react&shell=/bin/bash");
    render(<BreadCrumb />, { wrapper: MemoryRouter });
    const item = await screen.findAllByTestId(/path-container/i);
    expect(item).toHaveLength(3);
  });
});

