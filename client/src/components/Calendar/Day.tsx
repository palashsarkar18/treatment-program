import React from "react";
import { format, isSameMonth, isSameDay, getWeek } from "date-fns";
import { ProgramData, ProgramDay } from "../../types/calendarTypes";

interface DayProps {
  day: Date;
  currentDate: Date;
  dayActivity?: ProgramDay;
}

const Day: React.FC<DayProps> = ({ day, currentDate, dayActivity }) => {
  console.log(`Rendering day: ${format(day, "yyyy-MM-dd")}`);
  console.log(day, " vs ", dayActivity);

  const dayClasses = `col cell ${
    !isSameMonth(day, currentDate)
      ? "disabled"
      : isSameDay(day, new Date())
      ? "selected"
      : ""
  }`;

  const numberClasses = `date-number ${
    dayActivity && !isSameDay(day, new Date()) ? "activity" : ""
  }`;

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

export default Day;
