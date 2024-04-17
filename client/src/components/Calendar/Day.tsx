import React from "react";
import { format, isSameMonth, isSameDay, getWeek } from "date-fns";
import { ProgramDay } from "../../types/calendarTypes";

// Define the props expected by the Day component.
interface DayProps {
  day: Date;            // Represents the date to be displayed.
  currentDate: Date;    // Current date to compare against for styling.
  dayActivity?: ProgramDay; // Optional activity details for the day.
}

/**
 * Day component to render a single day cell in a calendar.
 * Displays the date and any associated activity.
 * Highlights today's date and greys out dates not in the current month.
 *
 * @param {DayProps} props - Contains day, currentDate, and optional dayActivity.
 */
const Day: React.FC<DayProps> = ({ day, currentDate, dayActivity }) => {
  // Log the rendering of the day for debugging purposes.
  console.log(`Rendering day: ${format(day, "yyyy-MM-dd")}`);
  console.log(day, " vs ", dayActivity);
  
  // Determine the CSS classes for the day cell based on whether it's the current day,
  // a day in the current month, or associated with an activity.
  const dayClasses = `col cell ${
    !isSameMonth(day, currentDate) // If not the same month, disable style.
      ? "disabled"
      : isSameDay(day, currentDate) // If it's today, apply 'selected' style.
      ? "selected"
      : ""
  }`;

  // Determine the CSS classes for the date number within the cell.
  // Applies 'activity' class if there's an associated activity and it's not today.
  const numberClasses = `date-number ${
    dayActivity && !isSameDay(day, currentDate) ? "activity" : ""
  }`;

  // Render the table cell with appropriate styles and content.
  return (
    <td className={dayClasses} key={format(day, "yyyy-MM-dd")}>
      <div className={numberClasses}>{format(day, "d")}</div>
      <h3>
        {dayActivity && dayActivity.title
          ? dayActivity.title.toUpperCase() 
          : "\u00A0"}
      </h3>
    </td>
  );
};

export default Day; // Export the component for use in other parts of the application.
