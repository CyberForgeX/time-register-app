import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import "@testing-library/jest-dom/extend-expect";
import {
  TimeEntryForm,
  TimeEntryList,
  CalendarIntegration,
  ErrorList,
  Filter,
  ReportExport,
  TimeAdjustment,
  Timesheet,
  Home,
} from "../src/components";
import { App, Document } from "../src";
import { getTimeEntries, addTimeEntry, deleteTimeEntry} from "../src/api/time-entries";
import { TimeEntry } from "../src/types/TimeEntry";

jest.mock("../src/api/time-entries");

const components = [
  { name: "CalendarIntegration", Component: CalendarIntegration, label: "Calendar" },
  { name: "ErrorList", Component: ErrorList, label: "Error List" },
  { name: "Filter", Component: Filter, label: "Filter" },
  { name: "ReportExport", Component: ReportExport, label: "Export" },
  { name: "TimeAdjustment", Component: TimeAdjustment, label: "Time Adjustment" },
  { name: "TimeEntryForm", Component: TimeEntryForm, label: "New Time Entry Form" },
  { name: "TimeEntryList", Component: TimeEntryList, label: "Time Entries List" },
  { name: "Timesheet", Component: Timesheet, label: "Time Entries Table" },
  { name: "Home", Component: Home, label: "Time Register App" },
  { name: "App", Component: App, label: "Time Register App" },
  { name: "Document", Component: Document, label: "Time Register App" },
];

test("checks for accessibility violations", async () => {
  await expectNoAccessibilityViolations(<App />);
});

const expectNoAccessibilityViolations = async (component: React.ReactElement) => {
  const { container } = render(component);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
};

describe("App", () => {
  test("renders the app", () => {
    render(<App />);
    const app = screen.getByLabelText("Time Register App");
    expect(app).toBeInTheDocument();
  });

  test.each(components)("renders the %s component", ({ Component, label }) => {
    render(<Component />);
    const component = screen.getByLabelText(label);
    expect(component).toBeInTheDocument();
  });

  test("has no accessibility violations", async () => {
    await expectNoAccessibilityViolations(<App />);
  });
});

describe("TimeEntry", () => {
  const timeEntries: TimeEntry[] = [
    {
      id: 1,
      date: "2022-01-01",
      project: "Project A",
      category: "Category A",
      description: "Description A",
      hours: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      date: "2022-01-02",
      project: "Project B",
      category: "Category B",
      description: "Description B",
      hours: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeAll(() => {
    (getTimeEntries as jest.MockedFunction<typeof getTimeEntries>).mockResolvedValue({
      success: true,
      data: timeEntries,
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("fetches and renders the time entries", async () => {
    render(<TimeEntryList />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
    const entries = await screen.findAllByRole("row");
    // Check that each entry is rendered correctly
entries.forEach((entry, index) => {
const currentEntry = timeEntries[index];
const dateCell = screen.getByText(currentEntry.date);
const projectCell = screen.getByText(currentEntry.project);
const categoryCell = screen.getByText(currentEntry.category);
const descriptionCell = screen.getByText(currentEntry.description);
const hoursCell = screen.getByText(currentEntry.hours.toString());
expect(dateCell).toBeInTheDocument();
expect(projectCell).toBeInTheDocument();
expect(categoryCell).toBeInTheDocument();
expect(descriptionCell).toBeInTheDocument();
expect(hoursCell).toBeInTheDocument();
expect(entry).toContainElement(dateCell);
expect(entry).toContainElement(projectCell);
expect(entry).toContainElement(categoryCell);
expect(entry).toContainElement(descriptionCell);
expect(entry).toContainElement(hoursCell);
});
});

test("handles API error", async () => {
(getTimeEntries as jest.MockedFunction<typeof getTimeEntries>).mockResolvedValue({
success: false,
error: {
message: "API error",
statusCode: 500,
},
});
render(<TimeEntryList />);
const loading = screen.getByText("Loading...");
expect(loading).toBeInTheDocument();
const error = await screen.findByText("API error");
expect(error).toBeInTheDocument();
});

test("deletes a time entry", async () => {
const deleteId = timeEntries[0].id;
(getTimeEntries as jest.MockedFunction<typeof getTimeEntries>).mockResolvedValue({
success: true,
data: timeEntries,
});
(deleteTimeEntry as jest.MockedFunction<typeof deleteTimeEntry>).mockResolvedValue({
success: true,
});
render(<TimeEntryList />);
const deleteButton = await screen.findByLabelText(`Delete time entry ${deleteId}`);
deleteButton.click();
expect(deleteTimeEntry).toHaveBeenCalledWith(deleteId);
expect(await screen.findAllByRole("row")).toHaveLength(timeEntries.length);
});

test("handles delete API error", async () => {
const deleteId = timeEntries[0].id;
(getTimeEntries as jest.MockedFunction<typeof getTimeEntries>).mockResolvedValue({
success: true,
data: timeEntries,
});
(deleteTimeEntry as jest.MockedFunction<typeof deleteTimeEntry>).mockResolvedValue({
success: false,
error: {
message: "API error",
statusCode: 500,
},
});
render(<TimeEntryList />);
const deleteButton = await screen.findByLabelText(`Delete time entry ${deleteId}`);
deleteButton.click();
expect(deleteTimeEntry).toHaveBeenCalledWith(deleteId);
const error = await screen.findByText("API error");
expect(error).toBeInTheDocument();
});
});