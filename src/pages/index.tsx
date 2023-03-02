import Head from 'next/head';
import { useState } from 'react';
import AddTimeEntryForm from '../components/AddTimeEntryForm';
import Layout from '../components/Layout';
import TimeEntry from '../types/TimeEntry';
import ErrorList from '../components/ErrorList';
import styles from '../styles/Home.module.scss';

const Home: React.FC = () => {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [weekStart, setWeekStart] = useState<Date>(new Date());

  const handleAddTimeEntry = (newEntry: TimeEntry) => {
    setTimeEntries([...timeEntries, newEntry]);
  };

  const handleDeleteTimeEntry = (id: number) => {
    setTimeEntries(timeEntries.filter(entry => entry.id !== id));
  };

  const handleWeekChange = (direction: number) => {
    setWeekStart(new Date(weekStart.setDate(weekStart.getDate() + (direction * 7))));
  }

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const weekEntries = timeEntries.filter(entry => {
    const entryDate = new Date(entry.date);
    return entryDate >= weekStart && entryDate <= weekEnd;
  });

  const tableHeader = (
    <div className={styles.tableRow}>
      <div className={styles.tableCell}></div>
      {weekdays.map(day => (
        <div key={day} className={styles.tableCell}>{day}</div>
      ))}
    </div>
  );

  const tableRows = [];
  for (let hour = 0; hour < 24; hour++) {
    const rowEntries = weekEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate.getHours() === hour;
    });

    const rowCells = weekdays.map((_, index) => {
      const cellEntry = rowEntries.find(entry => {
        const entryDate = new Date(entry.date);
        return entryDate.getDay() === index;
      });

      return (
        <div key={index} className={styles.tableCell}>
          {cellEntry ? cellEntry.hours : '-'}
        </div>
      );
    });

    tableRows.push(
      <div key={hour} className={styles.tableRow}>
        <div className={styles.tableCell}>{hour}:00</div>
        {rowCells}
      </div>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Time Register Hours App</title>
        <meta name="description" content="A web app for registering working hours." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
        <h1 className={styles.heading}>Time Register Hours App</h1>
        <div className={styles.weekControl}>
          <button className={styles.button} onClick={() => handleWeekChange(-1)}>Prev week</button>
          <h2 className={styles.weekTitle}>{weekStart.toLocaleDateString()} - {weekEnd.toLocaleDateString()}</h2>
          <button className={styles.button} onClick={() => handleWeekChange(1)}>Next week</button>
        </div>
        <AddTimeEntryForm onAddTimeEntry={handleAddTimeEntry} />
        <div className={styles.table}>
          {tableHeader}
          {tableRows}
        </div>
      </div>
    </Layout>
  );
};

export default Home;