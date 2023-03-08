import { useState, useEffect } from "react";
import TimeEntryForm from './TimeEntryForm'
import { getTimeEntries, AddTimeEntry, DeleteTimeEntry, ApiResponse, ApiResult } from "../api/timeEntries";
import { GetServerSideProps } from "next";
import  Timesheet  from "./Timesheet";
import  CalendarIntegration  from "./CalendarIntegration";

type Props = {
  entries: TimeEntry[];
  onFilteredEntries: (filteredEntries: TimeEntry[]) => void;
  errors: { field: string; message: string }[];
  filteredEntries?: TimeEntry[];
};


const TimeEntryList: React.FC<Props> = ({ entries, onFilteredEntries, errors }) => {

  type SortType = "date" | "hours";
  const ENTRIES_PER_PAGE_OPTIONS = [5, 10, 20];
  const DEFAULT_ENTRIES_PER_PAGE = 5;
 
  const [loading, setLoading] = useState(true);
  const [timeEntries, setTimeEntries] = useState(entries);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEntries, setFilteredEntries] = useState<TimeEntry[]>([]);
  const [sortType, setSortType] = useState<SortType>("date");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(
    DEFAULT_ENTRIES_PER_PAGE
  );
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [dateFilterStart, setDateFilterStart] = useState<Date | null>(null);
  const [dateFilterEnd, setDateFilterEnd] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState("");

useEffect(() => {
  async function fetchData() {
    try {
      const result: ApiResult<TimeEntry[]> = await getTimeEntries();
      console.log("Result:", result);
      if (result.success) {
        setTimeEntries(result.data);
        setFilteredEntries(result.data);
        setLoading(false);
      } else {
        setError(result.error.message);
        setLoading(false);
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }
  fetchData();
}, [timeEntries]);


  const handleSort = (type: SortType) => {
    setSortType(type);
    setFilteredEntries((prev) =>
      [...prev].sort((a, b) =>
        type === "date"
          ? a.date < b.date
            ? -1
            : 1
          : a.hours < b.hours
            ? 1
            : -1
      )
    );
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleEdit = async (id: string, updatedEntry: TimeEntry) => {
    try {
      const result: ApiResult<TimeEntry> = await addTimeEntry(updatedEntry);
      if (result.success) {
        setTimeEntries((prev) =>
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
useEffect(() => {
  const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;
  const now = new Date().getTime();
  const weekAgo = now - oneWeekInMs;
  const weekEntries = filteredEntries.filter(entry => new Date(entry.date).getTime() >= weekAgo);
  const totalHours = weekEntries.reduce((acc, entry) => acc + entry.hours, 0);
  if (totalHours > 100) {
    setMessage("Number of hours exceeds 100 for the past week!");
  } else {
    setMessage("");
  }
}, [filteredEntries]);


            const handleFilter = () => {
            if (!dateFilterStart || !dateFilterEnd) {
            setError("Please select a valid date range.");
            return;
            }
            setFilteredEntries(
            timeEntries.filter(
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
            setFilteredEntries(timeEntries);
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
            setTimeEntries((prev) => prev.filter((entry) => entry.id !== id));
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
            setTimeEntries(
            term
            ? result.data.filter((entry) =>
            entry.description
            .toLowerCase()
            .includes(term.toLowerCase())
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
            const filteredEntries = timeEntries.filter((entry) => {
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
            const currentEntries = filteredEntries ? filteredEntries.slice(
            indexOfFirstEntry,
            indexOfLastEntry
            ) : [];

            if (loading) {
            return <div>Loading...</div>;
            }

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
           {message && <p>{message}</p>}
           {/* Render other components here */}
         </div>
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
             {errors && errors.map(({ field, message }) => (
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
  const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3000";
  try {
    const result: ApiResult<TimeEntry[]> = await getTimeEntries(API_BASE_URL);
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
