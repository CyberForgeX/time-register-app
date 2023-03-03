import { useState } from "react";
import dynamic from "next/dynamic";
import "react-calendar/dist/Calendar.css";
import styles from "./CalendarIntegration.module.css";

type CalenderIntegrationProps = {
  onDateSelected: (date: Date) => void;
};

const DynamicCalendar = dynamic(() => import("react-calendar"), {
  ssr: false,
});

const CalenderIntegration: React.FC<CalenderIntegrationProps> = ({
  onDateSelected,
}) => {
  const [date, setDate] = useState<Date>(new Date());

  const handleDateChange = (date: Date) => {
    setDate(date);
    onDateSelected(date);
  };

  const disabledDates = [
    new Date(2023, 3, 10), // April 10, 2023
    new Date(2023, 3, 15), // April 15, 2023
    new Date(2023, 3, 20), // April 20, 2023
  ];

  const tileDisabled = ({ activeStartDate, date, view }: any) => {
    if (view === "month") {
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();
      return disabledDates.some(
        (d) => d.getFullYear() === year && d.getMonth() === month && d.getDate() === day
      );
    }
  };

  return (
    <div className={`${styles.calendarContainer} bg-black`}>
      <h3 className={styles.title}>Calendar Integration</h3>
      <div className={styles.calendar}>
        {typeof window !== "undefined" && (
          <DynamicCalendar
            className ={styles.dynamicCalendar}
            value={date}
            onChange={handleDateChange}
            tileDisabled={tileDisabled}
            calendarType="US"
            minDate={new Date()}
            maxDate={new Date(2023, 11, 31)}
          />
        )}
      </div>
    </div>
  );
};

export default CalenderIntegration;