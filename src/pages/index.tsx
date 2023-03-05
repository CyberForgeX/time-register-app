import { useState } from "react";
import { GetServerSideProps } from "next";
import { TimeEntryList } from "../components/TimeEntryList/TimeEntryList";
import TimeEntry from "../types/TimeEntry";
import {getTimeEntries, AddTimeEntry, DeleteTimeEntry} from "../api/time-entries";

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

export default Home;
