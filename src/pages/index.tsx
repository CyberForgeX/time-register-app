import { NextPageContext } from "next";
import ReactDOMServer from "react-dom/server";
import Head from "next/head";
import { useState, useMemo } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/nb";
import styles from "../styles/pageStyling/Home.module.css";
import { GetServerSideProps } from "next";
import TimeEntry from "../types/TimeEntry";
import { getTimeEntries } from "../api/time-entries";
import CalenderIntegration from "../components/CalenderIntegration/CalenderIntegration";
import ErrorList from "../components/ErrorList/ErrorList";
import Filter from "../components/Filter/Filter";
import ReportExport from "../components/ReportExport/ReportExport";
import TimeEntryForm from "../components/TimeEntryForm/TimeEntryForm";
import TimeEntryList from "../components/TimeEntryList/TimeEntryList";
import Dashboard from "../components/Dashboard/_dashboard";
import Timesheet from "../components/Timesheet/Timesheet";

moment.locale("nb");

type HomeProps = {
  entries: TimeEntry[];
};

const Home: React.FC<HomeProps> = ({ entries }) => {
  // State for managing time entries and week start date
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [weekStart, setWeekStart] = useState<Date>(new Date());

  // Handlers for adding, deleting, and filtering time entries, and changing the week start date
  const handleAddTimeEntry = (newEntry: TimeEntry) => {
    if (!timeEntries || !weekStart) {
      console.error("Time entries or week start is null or undefined.");
      return;
    }

    const totalHoursThisWeek = timeEntries.reduce((total, entry) => {
      const entryDate = new Date(entry.date);
      const entryWeekStart = new Date(weekStart);
      entryWeekStart.setDate(entryWeekStart.getDate() - entryDate.getDay());
      if (
        entryWeekStart <= entryDate &&
        entryDate <
          new Date(
            weekStart.getFullYear(),
            weekStart.getMonth(),
            weekStart.getDate() + 7
          )
      ) {
        return total + entry.hours;
      }
      return total;
    }, 0);

    if (totalHoursThisWeek + newEntry.hours > 100) {
      alert("You have reached the 100-hour limit for this week.");
      return;
    }

    setTimeEntries([...timeEntries, newEntry]);
  };

  const handleDeleteTimeEntry = (id: number) => {
    setTimeEntries(timeEntries.filter((entry) => entry.id !== id));
  };

  const handleFilterChange = (project: string, category: string) => {
    const filteredEntries = entries.filter(
      (entry) => entry.project === project && entry.category === category
    );
    setTimeEntries(filteredEntries);
  };

  const handleWeekChange = (direction: number) => {
    const newWeekStart = new Date(weekStart);
    newWeekStart.setDate(newWeekStart.getDate() + direction * 7);
    setWeekStart(newWeekStart);
  };

  const handleDateSelected = (date: Date) => {
    setWeekStart(date);
  };

  // Memoized variables for the table header, table rows, and filtered time entries
  const weekdays = useMemo(() => {
    const startDate = new Date(weekStart);
    const weekdays = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDateindex);
return date.toLocaleDateString("default", { weekday: "short" });
});
return weekdays;
}, [weekStart]);
const weekEnd = useMemo(() => {
const endDate = new Date(weekStart);
endDate.setDate(weekStart.getDate() + 6);
return endDate;
}, [weekStart]);
const handleExport = () => {
const csvRows = [
["Date", "Project", "Category", "Description", "Hours"],
...filteredEntries.map((entry) => [
entry.date,
entry.project,
entry.category,
entry.description,
entry.hours,
]),
];
const csvContent =
"data:text/csv;charset=utf-8," +
csvRows.map((row) => row.join(",")).join("\n");
const encodedUri = encodeURI(csvContent);
const link = document.createElement("a");
link.setAttribute("href", encodedUri);
link.setAttribute("download", "time_entries.csv");
document.body.appendChild(link);
link.click();
document.body.removeChild(link);
};
const filteredEntries = useMemo(() => {
if (!timeEntries || !weekStart) {
return [];
}
return timeEntries.filter((entry) => {
const entryDate = new Date(entry.date);
const entryWeekStart = new Date(weekStart);
entryWeekStart.setDate(entryWeekStart.getDate() - entryDate.getDay());
return (
entryWeekStart <= entryDate &&
entryDate <
new Date(
weekStart.getFullYear(),
weekStart.getMonth(),
weekStart.getDate() + 7
)
);
});
}, [timeEntries, weekStart]);
// Memoized variables for the table header, table rows, and filtered time entries
const tableHeader = useMemo(() => {
  return (
    <div className={`${styles.tableHeader} ${styles.timeTableRow}`}>
      <div className={`${styles.tableCell} ${styles.timeTableCell}`}>Date</div>
      <div className={`${styles.tableCell} ${styles.timeTableCell}`}>Project</div>
      <div className={`${styles.tableCell} ${styles.timeTableCell}`}>Category</div>
      <div className={`${styles.tableCell} ${styles.timeTableCell}`}>Description</div>
      <div className={`${styles.tableCell} ${styles.timeTableCell}`}>Hours</div>
    </div>
  );
}, []);
const tableRows = useMemo(() => {
  return filteredEntries.map((entry) => {
    return (
      <div key={entry.id} className={`${styles.tableRow} ${styles.timeTableRow}`}>
        <div className={`${styles.tableCell} ${styles.timeTableCell}`}>
          {new Date(entry.date).toLocaleDateString()}
        </div>
        <div className={`${styles.tableCell} ${styles.timeTableCell}`}>
          {entry.project}
        </div>
        <div className={`${styles.tableCell} ${styles.timeTableCell}`}>
          {entry.category}
        </div>
        <div className={`${styles.tableCell} ${styles.timeTableCell}`}>
          {entry.description}
        </div>
        <div className={`${styles.tableCell} ${styles.timeTableCell}`}>
          {entry.hours}
        </div>
      </div>
    );
  });
}, [filteredEntries]);
// State for managing form errors
const [formErrors, setFormErrors] = useState<string[]>([]);
// Handler for validating and submitting time entry form
const handleFormSubmit = (newEntry: TimeEntry) => {
setFormErrors([]);
const errors: string[] = [];
if (!newEntry.date) {
errors.push("Date is required.");
}
if (!newEntry.project) {if (!newEntry.project) {
  errors.push("Project is required.");
}
if (!newEntry.category) {
  errors.push("Category is required.");
}
if (!newEntry.hours) {
  errors.push("Hours is required.");
} else if (newEntry.hours < 0 || newEntry.hours > 24) {
  errors.push("Hours must be between 0 and 24.");
}
if (errors.length > 0) {
  setFormErrors(errors);
  return;
}
handleAddTimeEntry(newEntry);
};

return (
<div>
<Head>
  <title>Time Tracking App</title>
</Head>
<div className={styles.container}>
  <h1 className={styles.heading}>Time Tracking App</h1>
  <div className={styles.grid}>
    <div className={styles.card}>
      <Dashboard
        timeEntries={timeEntries}
        weekStart={weekStart}
        onWeekChange={handleWeekChange}
        onDateSelected={handleDateSelected}
      />
    </div>
    <div className={styles.card}>
      <div className={styles.flex}>
        <CalenderIntegration
          localizer={momentLocalizer(moment)}
          events={timeEntries}
        />
      </div>
    </div>
    <div className={styles.card}>
      <div className={styles.flex}>
        <Filter onFilterChange={handleFilterChange} entries={entries} />
      </div>
      <div className={styles.flex}>
        <ErrorList errors={formErrors} />
        <TimeEntryForm onSubmit={handleFormSubmit} />
      </div>
      <div className={styles.flex}>
        <TimeEntryList
          header={tableHeader}
          rows={tableRows}
          onDelete={handleDeleteTimeEntry}
        />
        <ReportExport onExport={handleExport} />
      </div>
    </div>
    <div className={styles.card}>
      <Timesheet entries={timeEntries} weekStart={weekStart} weekEnd={weekEnd} />
    </div>
  </div>
</div>
</div>
);
};

export const getServerSideProps: GetServerSideProps = async (
context: NextPageContext
) => {
const entries = await getTimeEntries();
return {
props: {
  entries,
},
};
};

export default Home;