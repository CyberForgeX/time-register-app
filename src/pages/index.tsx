import { useState } from "react";
import { GetServerSideProps } from "next";
import { TimeEntryList } from "../components/TimeEntryList/TimeEntryList";
import TimeEntry from "../types/TimeEntry";
import entries from "../api/time-entries";

type Props = {
  entries: TimeEntry[];
};

const Home = ({ entries }: Props) => {
  const [filteredEntries, setFilteredEntries] = useState(entries);

  const handleEntriesFilter = (filteredEntries: TimeEntry[]) => {
    setFilteredEntries(filteredEntries);
  };

  return (
    <div>
      <TimeEntryList
        entries={filteredEntries}
        onFilteredEntries={handleEntriesFilter}
      />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch(
    `${process.env.API_BASE_URL || "http://localhost:3000"}/time-entries`
  );
  const entries = await res.json();
  return { props: { entries } };
};

export default Home;
