import Head from "next/head";
import { useState, useMemo } from "react";
importTimeEntryForm from "../components/AddTimeEntryForm/AddTimeEntryForm";
import TimeEntry from "../types/TimeEntry";
import styles from "../styles/pageStyling/Home.module.css";

const Home: React.FC = () => {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [weekStart, setWeekStart] = useState<Date>(new Date());

  const handleAddTimeEntry = (newEntry: TimeEntry) => {
    setTimeEntries([...timeEntries, newEntry]);
  };

  const handleDeleteTimeEntry = (id: number) => {
    setTimeEntries(timeEntries.filter((entry) => entry.id !== id));
  };

  const handleWeekChange = (direction: number) => {
    const newWeekStart = new Date(weekStart);
    newWeekStart.setDate(newWeekStart.getDate() + direction * 7);
    setWeekStart(newWeekStart);
  };

  const weekEnd = useMemo(() => {
    const newWeekEnd = new Date(weekStart);
    newWeekEnd.setDate(newWeekEnd.getDate() + 6);
    return newWeekEnd;
  }, [weekStart]);

  const weekdays = useMemo(() => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], []);

  const weekEntries = useMemo(
    () =>
      timeEntries.filter((entry) => {
        const entryDate = new Date(entry.date);
        return entryDate >= weekStart && entryDate <= weekEnd;
      }),
    [timeEntries, weekStart, weekEnd]
  );

  const tableHeader = (
    <div className={`${styles.tableRow} ${styles.tableHeader}`}>
      <div className={styles.tableCell}></div>
      <div className={styles.weekdayContainer}>
        {weekdays.map((day) => (
          <div
            key={day}
            className={`${styles.tableCell} ${styles.tableHeader}`}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );

  const tableRows = useMemo(
    () =>
      Array.from({ length: 24 }, (_, hour) => {
        const rowEntries = weekEntries.filter((entry) => {
          const entryDate = new Date(entry.date);
          return entryDate.getHours() === hour;
        });

        const rowCells = weekdays.map((_, index) => {
          const cellEntry = rowEntries.find((entry) => {
            const entryDate = new Date(entry.date);
            return entryDate.getDay() === index;
          });

          return (
            <div
              key={index}
              className={`${styles.tableCell} ${
                cellEntry ? styles.filledCell : styles.emptyCell
              }`}
            >
              {cellEntry ? cellEntry.hours : "-"}
            </div>
          );
        });

        return (
          <div key={hour} className={styles.tableRow}>
            <div
              className={`${styles.tableCell} ${styles.tableHeader}`}
            >{`${hour}:00`}</div>
            {rowCells}
          </div>
        );
      }),
    [weekEntries, weekdays]
  );

  return (
  <>
    <Head>
      <title>Time Register Hours App</title>
      <meta
        name="description"
        content="A web app for registering working hours."
      />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <div id={styles.appContainer}>
      <h1 id={styles.appTitle}>Time Register Hours App</h1>
      <div id={styles.weekNavContainer}>
        <button
          id={styles.prevWeekBtn}
          onClick={() => handleWeekChange(-1)}
        >
          Prev week
        </button>
        <h2 id={styles.weekTitle}>
          {weekStart.toLocaleDateString()} - {weekEnd.toLocaleDateString()}
        </h2>
        <button
          id={styles.nextWeekBtn}
          onClick={() => handleWeekChange(1)}
        >
          Next week
        </button>
      </div>
      <AddTimeEntryForm onAddTimeEntry={handleAddTimeEntry} />
      <div id={styles.timeTableContainer}>
        <div className={`${styles.table} ${styles.timeTable}`}>
          {tableHeader}
          {tableRows}
        </div>
      </div>
      <div id={styles.featuresContainer}>
        <h2>Additional features to consider:</h2>
        <ul>
          <li>Ability to edit existing time entries</li>
          <li>Ability to filter time entries by date, project, or category</li>
          <li>Integration with a calendar or scheduling app</li>
          <li>Ability to generate reports or export data</li>
          <li>Integration with a payroll or invoicing system</li>
          <li>Multi-language support</li>
        </ul>
      </div>
    </div>
  </>
);
};

export default Home;