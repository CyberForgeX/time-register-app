import { useState } from "react";
import TimeEntry from "../../types/TimeEntry";

type TimesheetProps = {
  timeEntries: TimeEntry[];
  onEditEntry: (entry: TimeEntry) => void;
  onDeleteEntry: (entry: TimeEntry) => void;
};

const Timesheet: React.FC<TimesheetProps> = ({
  timeEntries,
  onEditEntry,
  onDeleteEntry,
}) => {
  const [selectedEntryId, setSelectedEntryId] = useState<number | null>(null);

  const handleEditEntry = (entry: TimeEntry) => {
    onEditEntry(entry);
    setSelectedEntryId(entry.id);
  };

  const handleDeleteEntry = (entry: TimeEntry) => {
    onDeleteEntry(entry);
    setSelectedEntryId(null);
  };

  const handleEntryClick = (entry: TimeEntry) => {
    setSelectedEntryId(entry.id);
  };

  const handleModalClose = () => {
    setSelectedEntryId(null);
  };

  const renderTimeEntries = () => {
    if (!timeEntries || timeEntries.length === 0) {
      return <p>No time entries found.</p>;
    }

    return (
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Hours</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {timeEntries.map((entry) => (
            <tr
              key={entry.id}
              className={
                selectedEntryId === entry.id ? styles.rowSelected : styles.row
              }
              onClick={() => handleEntryClick(entry)}
            >
              <td>{entry.date}</td>
              <td>{entry.description}</td>
              <td>{entry.hours}</td>
              <td>
                <button onClick={() => handleEditEntry(entry)}>Edit</button>
                <button onClick={() => handleDeleteEntry(entry)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div>
      <h1>Timesheet</h1>
      {renderTimeEntries()}
      {selectedEntryId !== null && (
        <div
         
          role="dialog"
          aria-labelledby="edit-modal-title"
        >
          <h2 id="edit-modal-title">Edit Time Entry</h2>
          <button onClick={handleModalClose}>Close</button>
        </div>
      )}
    </div>
  );
};

export default Timesheet;
