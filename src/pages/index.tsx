import Head from "next/head";
import styles from "../styles/pageStyling/Home.module.css";

import CalendarIntegration from "../components/CalendarIntegration/CalendarIntegration";
import { TimeEntry } from "../types/TimeEntry"; // import the TimeEntry type

type HomeProps = {
  entries: TimeEntry[];
};

const Home: React.FC<HomeProps> = ({ entries }) => { // pass the entries as props
  return (
    <>
      <Head>
        <title>Time Tracking App</title>
      </Head>
      <div className={styles.container}>
        <h1 className={styles.heading}>Time Tracking App</h1>
        <CalendarIntegration
          events={entries} // pass the entries to the CalendarIntegration component
        />
      </div>
    </>
  );
};

export default Home;