import { useState } from 'react';
import TimeEntry from '../../types/TimeEntry';
import styles from './Timesheet.module.css';

type TimesheetProps = {
  timeEntries: TimeEntry[];
};

const Timesheet: React.FC<TimesheetProps> = ({ timeEntries }) => {
  const [selectedEntry, setSelectedEntry] = useState<TimeEntry | null>(null);

  const handleEditEntry = (entry: TimeEntry) => {
    setSelectedEntry(entry);
  };

  const handleDeleteEntry = (entry: TimeEntry) => {
    // TODO: Implement delete functionality
  };

  const renderTimeEntries = () => {
if (!timeEntries || timeEntries.length === 0) {
  return <p>No time entries found.</p>;
}

    return (
      <table className={classNames(styles.table)}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Project</th>
            <th>Category</th>
            <th>Description</th>
            <th>Duration</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {timeEntries.map((entry) => (
            <tr key={entry.id} className={classNames({ [styles.evenRow]: entry.id % 2 === 0, [styles.hoverRow]: !selectedEntry || selectedEntry.id !== entry.id })}>
              <td>{entry.date}</td>
              <td>{entry.project}</td>
              <td>{entry.category}</td>
              <td>{entry.description}</td>
              <td>{entry.duration}</td>
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
    <div className={styles.timesheet}>
      <h1>Timesheet</h1>
      {renderTimeEntries()}
      {selectedEntry && (
        <div className={classNames(styles.modal)}>
          <h2>Edit Time Entry</h2>
          {/* TODO: Implement edit form */}
          <button onClick={() => setSelectedEntry(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default Timesheet;