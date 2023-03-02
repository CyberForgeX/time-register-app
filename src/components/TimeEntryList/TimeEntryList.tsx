import { useState } from 'react';
import TimeEntry from '../types/TimeEntry';
import ErrorList from '../ErrorList/ErrorList.tsx';

type Props = {
  entries: TimeEntry[],
};

const TimeEntryList = ({ entries }: Props) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEntries = entries.filter((entry) => {
    return entry.comment.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
<div className="p-4">
  <div className="mb-4">
    <label htmlFor="search" className="block font-bold mb-2">
      Search:
    </label>
    <input
      type="text"
      id="search"
      name="search"
      value={searchTerm}
      onChange={handleSearch}
      className="border rounded-lg p-2 w-full"
    />
  </div>
  <TimeEntryList entries={filteredEntries} />
</div>
  );
};

export default TimeEntryList;