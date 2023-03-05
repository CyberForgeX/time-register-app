import { useState, useEffect } from "react";
import { TimeEntryForm } from "../TimeEntryForm/TimeEntryForm";
import { getTimeEntries, AddTimeEntry, DeleteTimeEntry, ApiResponse, ApiResult } from "../../api/timeEntries";
import type { GetServerSideProps } from "next";
import { Timesheet } from "../Timesheet/Timesheet";
import { CalendarIntegration } from "../CalendarIntegration/CalendarIntegration";

type Props = {
  entries: TimeEntry[];
  onFilteredEntries: (filteredEntries: TimeEntry[]) => void;
   errors: { field: string; message: string }[];
};

type SortType = "date" | "hours";

const ENTRIES_PER_PAGE_OPTIONS = [5, 10, 20];
const DEFAULT_ENTRIES_PER_PAGE = 5;

const TimeEntryList: React.FC<Props> = (props) => {
  const [entries, setEntries] = useState(props.entries);
   const [searchTerm, setSearchTerm] = useState("");
   const [filteredEntries, setFilteredEntries] = useState(entries);
   const [sortType, setSortType] = useState<SortType>("date");
   const [currentPage, setCurrentPage] = useState(1);
   const [entriesPerPage, setEntriesPerPage] = useState(
     DEFAULT_ENTRIES_PER_PAGE
   );
   const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
   const [dateFilterStart, setDateFilterStart] = useState<Date | null>(null);
   const [dateFilterEnd, setDateFilterEnd] = useState<Date | null>(null);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
     setFilteredEntries(entries);
   }, [entries]);

  const handleSort = (type: SortType) => {
    setSortType(type);
    setEntries([...prev].sort((a, b) =>
      type === "date"
        ? a.date < b.date
          ? -1
          : 1
        : a.hours < b.hours
        ? 1
        : -1
    ));

    setEntries(
      entries.filter(
        (entry) =>
          new Date(entry.date) >= dateFilterStart &&
          new Date(entry.date) <= dateFilterEnd
      )
    );

    setEntries(
      term
        ? props.entries.filter((entry) =>
            entry.description.toLowerCase().includes(term.toLowerCase())
          )
        : props.entries
    );

    setEntries(prev.filter((entry) => entry.id !== id));
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

const handleEdit = async (id: string, updatedEntry: TimeEntry) => {
  try {
    const result: ApiResult<TimeEntry> = await addTimeEntry(updatedEntry);
    if (result.success) {
      setEntries((prev) =>
        prev.map((entry) => (entry.id === id ? result.data : entry))
      );
      setEditingEntryId(null);
    } else {
      setError(result.error.message);
    }
  } catch (error) {
    setError(error.message);
  }
};


  const handleFilter = () => {
    if (!dateFilterStart || !dateFilterEnd) {
      setError("Please select a valid date range.");
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
    const result: ApiResult<never> = await deleteTimeEntry(id);
    if (result.success) {
      setEntries((prev) => prev.filter((entry) => entry.id !== id));
    } else {
      setError(result.error.message);
    }
  } catch (error) {
    setError(error.message);
  }
};
const handleSearch = async (term: string) => {
  setSearchTerm(term);
  try {
    const result: ApiResult<TimeEntry[]> = await getTimeEntries();
    if (result.success) {
      setEntries(
        term
          ? result.data.filter((entry) =>
              entry.description.toLowerCase().includes(term.toLowerCase())
            )
          : result.data
      );
    } else {
      setError(result.error.message);
    }
  } catch (error) {
    setError(error.message);
  }
};

  const handleDateSelected = (date: Date | null) => {
    // Filter entries to show only those for the selected date
    const filteredEntries = entries.filter((entry) => {
      const entryDate = new Date(entry.date);
      return (
        entryDate.getFullYear() === date?.getFullYear() &&
        entryDate.getMonth() === date?.getMonth() &&
        entryDate.getDate() === date?.getDate()
      );
    });

    // Update the state to show the filtered entries and reset other filters
    setFilteredEntries(filteredEntries);
    setDateFilterStart(null);
    setDateFilterEnd(null);
    setSearchTerm("");
    setSortType("date");
    setCurrentPage(1);
    setEntriesPerPage(DEFAULT_ENTRIES_PER_PAGE);
    setEditingEntryId(null);
  };

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredEntries.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );

  return (
    <div>
      <CalendarIntegration
        events={entries}
        onDateSelected={handleDateSelected}
      />
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
          {ENTRIES_PER_PAGE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="dateFilterStart">Start Date:</label>
        <input
          type="date"
          id="dateFilterStart"
          value={
            dateFilterStart ? dateFilterStart.toISOString().split("T")[0] : ""
          }
          onChange={handleDateFilterStartChange}
        />
        <label htmlFor="dateFilterEnd">End Date:</label>
        <input
          type="date"
          id="dateFilterEnd"
          value={dateFilterEnd ? dateFilterEnd.toISOString().split("T")[0] : ""}
          onChange={handleDateFilterEndChange}
        />
        <button onClick={handleFilter}>Filter</button>
        <button onClick={handleClearFilters}>Clear Filters</button>
      </div>
      <h2>Error</h2>
           <ul>
             {errors.map(({ field, message }) => (
               <li key={field}>
                 <strong>{field}: </strong>
                 {message}
               </li>
             ))}
           </ul>
      <Timesheet
        entries={currentEntries}
        onDelete={handleDelete}
        onEdit={(id) => setEditingEntryId(id)}
        onDateSelected={handleDateSelected}
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

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  try {
    const result: ApiResult<TimeEntry[]> = await getTimeEntries();
    if (result.success) {
      return {
        props: {
          entries: result.data,
          errors: [],
        },
      };
    } else {
      return {
        props: {
          entries: [],
          errors: [{ field: "server", message: result.error.message }],
        },
      };
    }
  } catch (error) {
    return {
      props: {
        entries: [],
        errors: [{ field: "server", message: error.message }],
      },
    };
  }
};


export default TimeEntryList;
