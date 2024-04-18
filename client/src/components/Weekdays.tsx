import React from "react";
import { format, startOfWeek, addDays } from "date-fns";

interface WeekdaysProps {
  currentDate: Date; // Define the type of currentDate as Date
}

/**
 * Weekdays Component
 * 
 * This component renders the days of the week as headers in a calendar view.
 * It is used as a static presentation component within the Calendar component to
 * visually display the names of weekdays aligned with the respective days in the calendar.
 *
 * The component is designed to be simple and reusable, making no assumptions about
 * the state or management of the dates it represents. This ensures that it can be
 * flexibly used in any part of the application where a consistent weekday header is needed.
 */
const Weekdays: React.FC<WeekdaysProps> = ({ currentDate }) => {
  // Get the start of the week (Monday)
  const start = startOfWeek(currentDate, { weekStartsOn: 1 });

  // Generate the weekdays using a loop to add days
  const weekdays = [];
  for (let i = 0; i < 7; i++) {
    const day = addDays(start, i);
    weekdays.push(format(day, "eee").toUpperCase()); // 'eee' for three-letter abbreviation, and make it uppercase
  }

  return (
    <thead>
      <tr className="row header">
        {weekdays.map((day, index) => (
          <th className="col header-cell" key={index}>
            {day}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default Weekdays;
