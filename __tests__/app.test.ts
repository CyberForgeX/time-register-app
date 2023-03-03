import { render, screen } from "@testing-library/react";
import Home from "../src/pages/index";
import { axe } from "jest-axe";
import "@testing-library/jest-dom/extend-expect";

expect.extend(toHaveNoViolations);

describe("Home page", () => {
  beforeEach(() => {
    render(<Home /> as any);
  });

  test("should render all required components", () => {
    const calendar = screen.getByLabelText("Calendar");
    const filter = screen.getByLabelText("Filter");
    const form = screen.getByLabelText("New Time Entry Form");
    const list = screen.getByLabelText("Time Entries List");
    const exportButton = screen.getByRole("button", { name: "Export" });
    const table = screen.getByLabelText("Time Entries Table");

    expect(calendar).toBeInTheDocument();
    expect(filter).toBeInTheDocument();
    expect(form).toBeInTheDocument();
    expect(list).toBeInTheDocument();
    expect(exportButton).toBeInTheDocument();
    expect(table).toBeInTheDocument();
  });

  test("should not have any a11y violations", async () => {
    const { container } = render(<Home /> as any);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});