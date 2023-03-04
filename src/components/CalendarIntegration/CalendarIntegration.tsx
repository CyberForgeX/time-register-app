import { useState } from "react";
import dynamic from "next/dynamic";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import styles from "./CalendarIntegration.module.css";
import TimeEntry from "../../types/TimeEntry";
import TimeEntryList from "../TimeEntryList/TimeEntryList";

type CalendarIntegrationProps = {
  onDateSelected: (date: Date) => void;
  events: TimeEntry[];
  disabledDates?: Date[];
};

const DynamicCalendar = dynamic(() => import("react-big-calendar"), {
  ssr: false,
});

const CalendarIntegration: React.FC<CalendarIntegrationProps> = ({
  onDateSelected,
  events,
  disabledDates = [],
}) => {
  const [date, setDate] = useState<Date>(new Date());

  const handleDateChange = (date: Date) => {
    setDate(date);
    if (typeof onDateSelected === "function") {
      onDateSelected(date);
    } else {
      console.warn(
        "The 'onDateSelected' prop passed to CalendarIntegration is not a function."
      );
    }
  };

  const tileDisabled = ({ activeStartDate, date, view }: any) => {
    if (view === "month") {
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();
      return disabledDates.some(
        (d) =>
          d.getFullYear() === year &&
          d.getMonth() === month &&
          d.getDate() === day
      );
    }
  };

  // Use Norwegian locale for calendar
  moment.locale("nb");

  return (
    <div className={`${styles.calendarContainer} bg-black`}>
      <h3 className={styles.title}>Kalenderintegrasjon</h3>
      <div className={styles.calendar}>
        <div className={styles.calendarLeft}>
          {typeof window !== "undefined" && (
            <Calendar
              className={styles.dynamicCalendar}
              value={date}
              onChange={handleDateChange}
              tileDisabled={tileDisabled}
              calendarType="US"
              minDate={new Date()}
              maxDate={new Date(2023, 11, 31)}
              localizer={momentLocalizer(moment)}
              events={events.map((entry) => ({
                title: `${entry.project} - ${entry.category}`,
                start: new Date(entry.date),
                end: new Date(entry.date),
              }))}
            />
          )}
        </div>
        <div className={styles.calendarRight}>
          <TimeEntryList />
        </div>
      </div>
    </div>
  );
};

export default CalendarIntegration;