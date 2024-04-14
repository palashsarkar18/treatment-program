import React, { useState } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  format,
  getWeek,
} from "date-fns";

import "./Calendar.css"; // Make sure the path matches where you place your CSS file
import { ProgramDay, ProgramData } from "../Calendar/types"; // Adjust the path as necessary

// Import your JSON data
const programData: ProgramData = require("./program.json");

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // This function creates the dates for the entire month, grouped by week
  const generateMonth = () => {
    // Get the first day of the month
    const startDay = startOfMonth(currentDate);
    // Adjust the start of the month to start on the nearest Monday
    const adjustedStartDay = startOfWeek(startDay, { weekStartsOn: 1 }); // 1 stands for Monday
    // Get the last day of the month
    const endDay = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 });

    let date = adjustedStartDay;
    const weeks = [];
    let week = [];

    // Loop through the days until the end of the month view is reached
    while (date <= endDay) {
      week.push(date);
      if (new Date(date).getDay() === 0 && week.length) {
        // If Sunday, push the week array
        weeks.push(week);
        week = [];
      }
      date = addDays(date, 1);
    }
    if (week.length) weeks.push(week); // Push the last week

    return weeks;
  };

  const renderDays = () => {
    const weeks = generateMonth();
    return (
      <tbody>
        {weeks.map((week, i) => (
          <tr className="row body" key={`week-${i}`}>
            {week.map((day) => renderDay(day))}
          </tr>
        ))}
      </tbody>
    );
  };

  const renderDay = (day: Date) => {
    const week = programData[`week${getWeek(day)}`];

    // Find program data for this day
    let programInfo = null;

    if (week) {
      for (const programDay of week) {
        const programDate = new Date(day);
        programDate.setHours(0, 0, 0, 0); // Reset time to compare dates accurately
        const dayOfWeek = programDate
          .toLocaleString("en-US", { weekday: "long" })
          .toUpperCase();
        if (programDay.weekday === dayOfWeek && isSameDay(programDate, day)) {
          programInfo = programDay;
          break;
        }
      }
    }

    const dayClasses = `col cell ${
      !isSameMonth(day, currentDate)
        ? "disabled"
        : isSameDay(day, new Date())
        ? "selected"
        : ""
    }`;

    const numberClasses = `date-number ${
      programInfo && programInfo.completed ? "completed" : ""
    }`;

    return (
      <td className={dayClasses} key={format(day, "yyyy-MM-dd")}>
        <div className={numberClasses}>{format(day, "d")}</div>
        <h3>
          {programInfo && programInfo.title ? programInfo.title : "\u00A0"}
        </h3>
      </td>
    );
  };

  const renderWeekdays = () => {
    // Get the start of the week (Monday)
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });

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

  return (
    <div className="calendar">
      <div className="header">
        <h1>Weekly Program</h1>
      </div>
      <table className="calendar-table">
        {renderWeekdays()}
        {renderDays()}
      </table>
    </div>
  );
};

export default Calendar;
