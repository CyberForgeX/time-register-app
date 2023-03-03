import { useState } from 'react';
import TimeEntry from '../../types/TimeEntry';
import ErrorList from '../ErrorList/ErrorList';
import { deleteTimeEntry } from '../../api/deleteTimeEntry';
import { GetServerSideProps } from 'next';

type Props = {
  entries: TimeEntry[],
};

type SortType = 'date' | 'hours';

const TimeEntryList = ({ entries }: Props) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEntries, setFilteredEntries] = useState(entries);
  const [sortType, setSortType] = useState<SortType>('date');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [dateFilterStart, setDateFilterStart] = useState<Date | null>(null);
  const [dateFilterEnd, setDateFilterEnd] = useState<Date | null>(null);
  const [error, setError] = useState('');

  const handleSort = (type: SortType) => {
    setSortType(type);
    setFilteredEntries((prev) => [...prev].sort((a, b) => (type === 'date' ? (a.date < b.date ? -1 : 1) : (a.hours < b.hours ? 1 : -1))));
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleEdit = (id: string, updatedEntry: TimeEntry) => {
    setFilteredEntries((prev) => prev.map((entry) => (entry.id === id ? updatedEntry : entry)));
    setEditingEntryId(null);
  };

  const handleFilter = () => {
    if (!dateFilterStart || !dateFilterEnd) {
      setError('Please select a valid date range.');
      return;
    }
    setFilteredEntries(entries.filter((entry) => new Date(entry.date) >= dateFilterStart && new Date(entry.date) <= dateFilterEnd));
    setDateFilterStart(null);
    setDateFilterEnd(null);
    setError('');
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilteredEntries(entries);
    setDateFilterStart(null);
    setDateFilterEnd(null);
    setError('');
    setCurrentPage(1);
  };

  const handleDateFilterStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateFilterStart(isNaN(new Date(e.target.value).getTime()) ? null : new Date(e.target.value));
  };

  const handleDateFilterEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateFilterEnd(isNaN(new Date(e.target.value).getTime()) ? null : new Date(e.target.value));
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTimeEntry(id);
      setFilteredEntries((prev) => prev.filter((entry) => entry.id !== id));
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setFilteredEntries(term ? entries.filter((entry) => entry.description.toLowerCase().includes(term.toLowerCase())) : entries);
    setCurrentPage(1);
  };

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
const currentEntries = filteredEntries ? filteredEntries.slice(indexOfFirstEntry, indexOfLastEntry) : [];
const totalPages = filteredEntries ? Math.ceil(filteredEntries.length / entriesPerPage) : 0;

const totalHours = filteredEntries ? filteredEntries.reduce((total, entry) => total + entry.hours, 0) : 0;

const entriesCount = filteredEntries ? filteredEntries.length : 0;
return (
<div className="flex flex-col items-start">
  <div className="flex justify-between w-full mb-4 space-x-4">
    <div className="flex-1">
      <input
        className="w-full border border-gray-400 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-accent-color focus:border-transparent"
        type="text"
        placeholder="Search by description"
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
    <div className="flex flex-row items-center space-x-4">
      <div>
        <input
          className="border border-gray-400 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-accent-color focus:border-transparent"
          type="date"
          value={dateFilterStart?.toISOString().substr(0, 10)}
          onChange={handleDateFilterStartChange}
        />
      </div>
      <div>
        <span>to</span>
      </div>
      <div>
        <input
          className="border border-gray-400 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-accent-color focus:border-transparent"
          type="date"
          value={dateFilterEnd?.toISOString().substr(0, 10)}
          onChange={handleDateFilterEndChange}
        />
      </div>
      <div>
        <button
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-color hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-color"
          onClick={handleFilter}
        >
          Filter
        </button>
      </div>
      <div>
        <button
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-color"
          onClick={handleClearFilters}
        >
          Clear
        </button>
      </div>
    </div>
  </div>
  <table className="w-full mb-4">
    <thead className="bg-gray-200">
      <tr>
        <th className="px-4 py-2 text-left font-medium">Date</th>
        <th className="px-4 py-2 text-left font-medium">Description</th>
        <th className="px-4 py-2 text-left font-medium">Hours</th>
        <th className="px-4 py-2 text-left font-medium">Actions</th>
      </tr>
    </thead>
    <tbody>
      {currentEntries.map((entry) => (
        <TimeEntry
          key={entry.id}
          entry={entry}
          editing={entry.id === editingEntryId}
          onEditStart={setEditingEntryId}
          onEditCancel={() => setEditingEntryId(null)}
          onEditSave={(updatedEntry) => handleEdit(entry.id, updatedEntry)}
          onDelete={() => handleDelete(entry.id)}
        />
      ))}
    </tbody>
  </table>
  <div className="flex flex-col items-start w-full mb-4">
    <span className="text-base font-medium text-gray-700">
      Showing {indexOfFirstEntry + 1}-{indexOfLastEntry} of{' '}
      {filteredEntries ? filteredEntries.length : 0} entries
</span>
<div className="flex flex-row items-center mt-2 space-x-4">
<button
className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-color"
disabled={currentPage === 1}
onClick={() => handlePageChange(currentPage - 1)}
>
Previous
</button>
<span className="text-base font-medium text-gray-700">
{currentPage} of {totalPages}
</span>
<button
className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-color"
disabled={currentPage === totalPages}
onClick={() => handlePageChange(currentPage + 1)}
>
Next
</button>
</div>
  </div>
  <div className="text-lg font-medium text-gray-700">Total Hours: {totalHours}</div>
  <ErrorList error={error} />
</div>
);
};

export default TimeEntryList;

export const getServerSideProps: GetServerSideProps = async () => {
const entries: TimeEntry[] = await res.json();

return {
props: {
entries,
},
};
};