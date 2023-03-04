import { useState } from 'react';
import TimeEntry from '../../types/TimeEntry';
import ErrorList from '../ErrorList/ErrorList';
import TimeEntryForm from '../TimeEntryForm/TimeEntryForm';
import { deleteTimeEntry } from '../../api/deleteTimeEntry';
import { GetServerSideProps } from 'next';
import Timesheet from '../Timesheet/Timesheet';

type Props = {
  entries: TimeEntry[];
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
  const [error, setError] = useState<string | null>(null);

  const handleSort = (type: SortType) => {
    setSortType(type);
    setFilteredEntries((prev) =>
      [...prev].sort((a, b) =>
        type === 'date' ? (a.date < b.date ? -1 : 1) : a.hours < b.hours ? 1 : -1
      )
    );
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleEdit = (id: string, updatedEntry: TimeEntry) => {
    setFilteredEntries((prev) =>
      prev.map((entry) => (entry.id === id ? updatedEntry : entry))
    );
    setEditingEntryId(null);
  };

  const handleFilter = () => {
    if (!dateFilterStart || !dateFilterEnd) {
      setError('Please select a valid date range.');
      return;
    }
    setFilteredEntries(
      entries.filter(
        (entry) =>
          new Date(entry.date) >= dateFilterStart &&
          new Date(entry.date) <= dateFilterEnd
      )
    );
    setDateFilterStart(null);
    setDateFilterEnd(null);
    setError(null);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilteredEntries(entries);
    setDateFilterStart(null);
    setDateFilterEnd(null);
    setError(null);
    setCurrentPage(1);
  };

  const handleDateFilterStartChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDateFilterStart(
      isNaN(new Date(e.target.value).getTime())
        ? null
        : new Date(e.target.value)
    );
  };

  const handleDateFilterEndChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDateFilterEnd(
      isNaN(new Date(e.target.value).getTime())
        ? null
        : new Date(e.target.value)
    );
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTimeEntry(id);
      setFilteredEntries((prev) =>
        prev.filter((entry) => entry.id !== id)
      );
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setFilteredEntries(
      term
        ? entries.filter((entry) =>
            entry.description
              .toLowerCase()
              .includes(term.toLowerCase )
)
: entries
);
};

const indexOfLastEntry = currentPage * entriesPerPage;
const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
const currentEntries = filteredEntries.slice(
indexOfFirstEntry,
indexOfLastEntry
);

return (
<div>
<TimeEntryForm
onSubmit={(entry) => setFilteredEntries([...filteredEntries, entry])}
/>
<div>
<label htmlFor="search">Search:</label>
<input
type="text"
id="search"
value={searchTerm}
onChange={(e) => handleSearch(e.target.value)}
/>
</div>
<div>
<label htmlFor="sort">Sort by:</label>
<select
id="sort"
value={sortType}
onChange={(e) => handleSort(e.target.value as SortType)}
>
<option value="date">Date</option>
<option value="hours">Hours</option>
</select>
</div>
<div>
<label htmlFor="entriesPerPage">Entries per page:</label>
<select
id="entriesPerPage"
value={entriesPerPage}
onChange={(e) => setEntriesPerPage(parseInt(e.target.value))}
>
<option value="5">5</option>
<option value="10">10</option>
<option value="20">20</option>
</select>
</div>
<div>
<label htmlFor="dateFilterStart">Start Date:</label>
<input
type="date"
id="dateFilterStart"
value={dateFilterStart ? dateFilterStart.toISOString().split('T')[0] : ''}
onChange={handleDateFilterStartChange}
/>
<label htmlFor="dateFilterEnd">End Date:</label>
<input
type="date"
id="dateFilterEnd"
value={dateFilterEnd ? dateFilterEnd.toISOString().split('T')[0] : ''}
onChange={handleDateFilterEndChange}
/>
<button onClick={handleFilter}>Filter</button>
<button onClick={handleClearFilters}>Clear Filters</button>
</div>
{error && <ErrorList errors={[error]} />}
<Timesheet
entries={currentEntries}
onDelete={handleDelete}
onEdit={(id) => setEditingEntryId(id)}
/>
<div>
{filteredEntries.length > entriesPerPage && (
<ul>
{Array(Math.ceil(filteredEntries.length / entriesPerPage))
.fill(null)
.map((_, i) => (
<li key={i}>
<button onClick={() => handlePageChange(i + 1)}>
{i + 1}
</button>
</li>
))}
</ul>
)}
</div>
{editingEntryId && (
<TimeEntryForm
entry={filteredEntries.find((entry) => entry.id === editingEntryId)}
onSubmit={(entry) => handleEdit(editingEntryId, entry)}
onCancel={() => setEditingEntryId(null)}
/>
)}
</div>
);
};

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch(`${process.env.API_BASE_URL || 'http://localhost:3000'}/time-entries`);
  const entries = await res.json();
  return { props: { entries } };
};

export default TimeEntryList;