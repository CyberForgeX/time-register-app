import { useState } from "react";
import { TimeEntry } from "../types/TimeEntry";
import {ErrorList} from "../ErrorList/ErrorList";
import styles from "./TimeEntryForm.module.css";
import {TimeAdjustment} from "../TimeAdjustment/TimeAdjustment";
import {ReportExport} from "../ReportExport/ReportExport";
import {Filter} from "../Filter/Filter";

type FormError = {
  field: string;
  message: string;
};

type TimeEntryFormProps = {
  timeEntries: TimeEntry[];
  entries: TimeEntry[];
  onAddTimeEntry: (entry: TimeEntry) => void;
  onDeleteTimeEntry: (id: number) => void;
};

const TimeEntryForm: React.FC<TimeEntryFormProps> = ({
  timeEntries,
  entries,
  onAddTimeEntry,
  onDeleteTimeEntry,
}) => {
  const [hours, setHours] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [formErrors, setFormErrors] = useState<FormError[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [reportData, setReportData] = useState<any>(null);
  const [filteredEntries, setFilteredEntries] = useState<TimeEntry[]>(entries);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors = validateForm();
    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    const newEntry: TimeEntry = {
      id: Date.now(),
      hours,
      comment,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    onAddTimeEntry(newEntry);
    setHours(0);
    setComment("");
    setFormErrors([]);
  };

  const validateForm = (): FormError[] => {
    const errors: FormError[] = [];

    if (hours <= 0 || hours > 24) {
      errors.push({
        field: "hours",
        message: "Hours must be between 1 and 24.",
      });
    }

    if (comment.trim().length === 0) {
      errors.push({ field: "comment", message: "Comment is required." });
    }

    return errors;
  };

  const handleHoursChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHours(parseInt(event.target.value));
  };

  const handleCommentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setComment(event.target.value);
  };

  const handleDeleteTimeEntry = (id: number) => {
    onDeleteTimeEntry(id);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    const filteredEntries = entries.filter((entry) => {
      return entry.comment.toLowerCase().includes(event.target.value.toLowerCase());
    });
    setFilteredEntries(filteredEntries);
  };

  const handleFilter = (filteredEntries: TimeEntry[]) => {
    setFilteredEntries(filteredEntries);
  };

  const handleExport = (data: any) => {
    setReportData(data);
  };

  return (
    <div className={styles.timeEntryForm}>
      <Filter timeEntries={timeEntries} onFilter={handleFilter} />
      <form onSubmit={handleSubmit} className={styles.formInputs}>
        <div className={styles.formGroup}>
          <label htmlFor="hours" className={styles.formLabel}>
            Hours:
          </label>
          <input
            type="number"
            id="hours"
            name="hours"
            className={styles.formControl}
            required         value={hours}
        onChange={handleHoursChange}
      />
    </div>
    <div className={styles.formGroup}>
      <label htmlFor="comment" className={styles.formLabel}>
        Comment:
      </label>
      <textarea
        id="comment"
        name="comment"
        className={styles.formControl}
        required
        value={comment}
        onChange={handleCommentChange}
      ></textarea>
    </div>
    <div className={styles.formGroup}>
      <button type="submit" className={styles.submitButton}>
        Add Entry
      </button>
    </div>
    {formErrors.length > 0 && <ErrorList errors={formErrors} />}
    <div className={styles.search}>
      <label htmlFor="search" className={styles.searchLabel}>
        Search:
      </label>
      <input
        type="text"
        id="search"
        name="search"
        className={styles.searchInput}
        value={searchTerm}
        onChange={handleSearchChange}
      />
    </div>
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Date</th>
          <th>Hours</th>
          <th>Comment</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {filteredEntries.map((entry) => (
          <tr key={entry.id}>
            <td>{entry.createdAt.toLocaleDateString()}</td>
            <td>{entry.hours}</td>
            <td>{entry.comment}</td>
            <td>
              <button
                className={styles.deleteButton}
                onClick={() => handleDeleteTimeEntry(entry.id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <TimeAdjustment
      timeEntries={timeEntries}
      onAddTimeEntry={onAddTimeEntry}
    />
    <ReportExport data={entries} onExport={handleExport} />
    {reportData && (
      <a href={reportData} download="report">
        Download Report
      </a>
    )}
  </form>
</div>
);
};

export default TimeEntryForm;