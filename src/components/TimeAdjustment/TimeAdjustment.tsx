import { useState } from 'react';
import TimeEntry from '../../types/TimeEntry';

type TimeAdjustmentProps = {
  timeEntries: TimeEntry[];
  onAddTimeEntry: (entry: TimeEntry) => void;
};

const TimeAdjustment: React.FC<TimeAdjustmentProps> = ({
  timeEntries,
  onAddTimeEntry,
}) => {
  const [date, setDate] = useState<Date>(new Date());
  const [project, setProject] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [hours, setHours] = useState<number>(0);

  const handleAddTimeEntry = () => {
    const newEntry: TimeEntry = {
      date: date.toISOString(),
      project: project,
      category: category,
      hours: hours,
    };

    const totalHoursThisWeek = timeEntries
      .filter((entry) => {
        const entryDate = new Date(entry.date);
        const today = new Date();
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
        return (
          entryDate.getFullYear() === date.getFullYear() &&
          entryDate.getMonth() === date.getMonth() &&
          entryDate.getDate() >= startOfWeek.getDate()
        );
      })
      .reduce((total, entry) => total + entry.hours, 0);

    if (totalHoursThisWeek + hours > 100) {
      alert('You have reached the 100-hour limit for this week.');
      return;
    }

    onAddTimeEntry(newEntry);
  };

  return (
    <div>
      <label htmlFor="date">Date:</label>
      <input
        type="date"
        id="date"
        value={date.toISOString().substr(0, 10)}
        onChange={(e) => setDate(new Date(e.target.value))}
      />

      <label htmlFor="project">Project:</label>
      <input
        type="text"
        id="project"
        value={project}
        onChange={(e) => setProject(e.target.value)}
      />

      <label htmlFor="category">Category:</label>
      <input
        type="text"
        id="category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      <label htmlFor="hours">Hours:</label>
      <input
        type="number"
        id="hours"
        value={hours}
        onChange={(e) => setHours(parseInt(e.target.value))}
      />

      <button onClick={handleAddTimeEntry}>Add Time Entry</button>
    </div>
  );
};

export default TimeAdjustment;