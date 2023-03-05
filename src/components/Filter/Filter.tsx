import { useState } from "react";
import TimeEntry from "../../types/TimeEntry";

type FilterProps = {
  timeEntries: TimeEntry[];
  onFilter: (filteredEntries: TimeEntry[]) => void;
};

const Filter: React.FC<FilterProps> = ({ timeEntries, onFilter }) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedProject, setSelectedProject] = useState<string>();
  const [selectedCategory, setSelectedCategory] = useState<string>();

  const handleFilter = () => {
    let filteredEntries = timeEntries;

    if (selectedDate) {
      filteredEntries = filteredEntries.filter(
        (entry) =>
          new Date(entry.date).getFullYear() === selectedDate.getFullYear() &&
          new Date(entry.date).getMonth() === selectedDate.getMonth() &&
          new Date(entry.date).getDate() === selectedDate.getDate()
      );
    }

    if (selectedProject) {
      filteredEntries = filteredEntries.filter(
        (entry) => entry.project === selectedProject
      );
    }

    if (selectedCategory) {
      filteredEntries = filteredEntries.filter(
        (entry) => entry.category === selectedCategory
      );
    }

    onFilter(filteredEntries);
  };

  const handleDateSelected = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <div>
      <h3>Filter</h3>
      <div>
        <div>
          <label htmlFor="date">
            Date:
          </label>
          <input
            type="date"
            id="date"
           
            value={selectedDate?.toISOString().substr(0, 10) || ""}
            onChange={(e) => handleDateSelected(new Date(e.target.value))}
          />
        </div>

        <div>
          <label htmlFor="project">
            Project:
          </label>
          <select
            id="project"
           
            value={selectedProject || ""}
            onChange={(e) => setSelectedProject(e.target.value)}
          >
            <option value="">All projects</option>
            <option value="Project A">Project A</option>
            <option value="Project B">Project B</option>
            <option value="Project C">Project C</option>
          </select>
        </div>

        <div>
          <label htmlFor="category">
            Category:
          </label>
          <select
            id="category"
           
            value={selectedCategory || ""}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All categories</option>
            <option value="Category A">Category A</option>
            <option value="Category B">Category B</option>
            <option value="Category C">Category C</option>
          </select>
        </div>

        <button onClick={handleFilter}>
          Filter
        </button>
      </div>
    </div>
  );
};

export default Filter;
