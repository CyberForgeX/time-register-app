import { GetServerSideProps } from 'next';
import Head from 'next/head';
import TimeEntry from '../../types/TimeEntry';
import TimeEntryList from '../../components/TimeEntryList/TimeEntryList';
import CalenderIntegration from '../../components/CalenderIntegration/CalenderIntegration';
import styles from './dashboard.module.css';
import { getTimeEntries } from '../../api/time-entries';

type DashboardProps = {
  entries: TimeEntry[];
};

const Dashboard: React.FC<DashboardProps> = ({ entries }) => {
  // Calculate total hours worked for the day
  const today = new Date().toISOString().substr(0, 10);
const totalHoursToday = entries ? entries.filter((entry) => entry.date === today).reduce((total, entry) => total + entry.hours, 0) : 0;

  // Calculate total hours worked for the week
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const weekEnd = new Date();
  weekEnd.setDate(weekEnd.getDate() + (6 - weekEnd.getDay()));
const totalHoursThisWeek = entries ? entries.filter((entry) => new Date(entry.date) >= weekStart && new Date(entry.date) <= weekEnd).reduce((total, entry) => total + entry.hours, 0) : 0;

  // Calculate total hours worked for the month
  const thisMonth = new Date().toISOString().substr(0, 7);
const totalHoursThisMonth = entries ? entries.filter((entry) => entry.date.substr(0, 7) === thisMonth).reduce((total, entry) => total + entry.hours, 0) : 0;

  return (
    <>
      <Head>
        <title>Time Register Hours App - Dashboard</title>
        <meta
          name="description"
          content="A dashboard for tracking working hours."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.container}>
        <h1>Dashboard</h1>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <h2>Today</h2>
            <p>{totalHoursToday.toFixed(2)} hours worked</p>
          </div>
          <div className={styles.stat}>
            <h2>This Week</h2>
            <p>{totalHoursThisWeek.toFixed(2)} hours worked</p>
          </div>
          <div className={styles.stat}>
            <h2>This Month</h2>
            <p>{totalHoursThisMonth.toFixed(2)} hours worked</p>
          </div>
        </div>
        <TimeEntryList entries={entries} />
        <CalenderIntegration onDateSelected={() => {}} />
      </div>
    </>
  );
};
export default Dashboard;

export const getServerSideProps: GetServerSideProps<DashboardProps> = async () => {
  try {
    const entries = await getTimeEntries();
    return {
      props: {
        entries,
      },
    };
  } catch (error) {
    console.error('Error fetching entries:', error);
    return {
      props: {
        entries: [],
      },
    };
  }
};



