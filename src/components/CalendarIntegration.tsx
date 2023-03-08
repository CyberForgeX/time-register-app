import { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import  TimeEntryList  from "./TimeEntryList";
import nbLocale from "moment/locale/nb";

type CalendarIntegrationProps = {
  onDateSelected: (date: Date | null) => void;
  events: TimeEntry[];
  disabledDates?: Date[];
};

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

  const handleDateSelected = (date: Date | null) => {
    if (typeof onDateSelected === "function") {
      onDateSelected(date);
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

  moment.locale("nb", nbLocale);

  return (
    <div>
      {events && events.length > 0 && (
        <>
          <h3>Kalenderintegrasjon</h3>
          <div>
            <div>
              {typeof window !== "undefined" && (
                <Calendar
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
                  onSelectEvent={(event) => handleDateSelected(event.start)}
                  titleAccessor={(event) =>
                    `${event.title} - ${moment(event.start).format("ll")}`
                  }
                  prevLabel="Forrige"
                  nextLabel="Neste"
                  allDayAccessor={() => true}
                  messages={{
                    allDay: "Hele dagen",
                    previous: "Forrige",
                    next: "Neste",
                    today: "I dag",
                    month: "Måned",
                    week: "Uke",
                    day: "Dag",
                    agenda: "Agenda",
                    date: "Dato",
                    time: "Tid",
                    event: "Hendelse",
                    noEventsInRange: "Ingen hendelser i denne perioden.",
                  }}
                />
              )}
            </div>
            <div>
              <TimeEntryList events={events} />
            </div>
          </div>
        </>
      )}
      {!events || events.length === 0 && (
        <p>Loading events...</p>
      )}
    </div>
  );
};

export default CalendarIntegration;