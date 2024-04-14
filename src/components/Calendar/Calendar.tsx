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
  startOfDay,
  startOfYear,
  addWeeks,
  getISOWeek,
} from "date-fns";

import "./Calendar.css"; // Make sure the path matches where you place your CSS file
import { ProgramDay, ProgramData, ProgramWeek } from "../Calendar/types"; // Adjust the path as necessary

// Import your JSON data
const programData: ProgramData = require("./program.json");

// TODO: Check validity of programData
// * Future events should always have "completed" as false.
// * There should be three consecutive weeks only.
// * The program should always start on the first full week of the month.
// Only one activity per day.

const Calendar: React.FC = () => {
  const [currentDate] = useState(new Date());

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
    const incompleteActivities: ProgramDay[] = findIncompleteActivities(
      programData,
      new Date().getFullYear()
    ); // Get incomplete activities

    // TODO: incompleteActivities has UTC tmezone. Make sure that it works correctly.
    // TODO: Make sure incompleteActivities is sorted in order of the date object.

    return (
      <tbody>
        {weeks.map((week, i) => (
          <tr className="row body" key={`week-${i}`}>
            {week.map((day) => renderDay(day, incompleteActivities))}
          </tr>
        ))}
      </tbody>
    );
  };

  const renderDay = (day: Date, incompleteActivities: ProgramDay[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let dayActivity = null;
    const isFuture = day >= today;

    const week: ProgramDay[] = programData[`week${getWeek(day)}`];

    if (week) {
      for (const programDay of week) {
        if (
          !isFuture &&
          programDay.completed &&
          programDay.weekday ===
            day.toLocaleString("en-US", { weekday: "long" }).toUpperCase()
        ) {
          // Show all the completed past activities
          dayActivity = programDay;
          break;
        } else if (
          isFuture &&
          programDay.weekday ===
            day.toLocaleString("en-US", { weekday: "long" }).toUpperCase()
        ) {
          // Show all the current and future activities
          dayActivity = programDay;
          break;
        } else if (isFuture && incompleteActivities.length > 0) {
          dayActivity = incompleteActivities.shift();
          break;
        }
      }
    } else if (
      isFuture &&
      incompleteActivities &&
      incompleteActivities.length > 0
    ) {
      dayActivity = incompleteActivities.shift(); // This assumes that `findIncompleteActivities` returns activities in order they should be moved.
      // TODO: This area requires further work I suppose.
    }

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
          {dayActivity && dayActivity.title ? dayActivity.title : "\u00A0"}
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

  const findIncompleteActivities = (
    programData: ProgramData,
    currentYear: number
  ): ProgramDay[] => {
    const today = startOfDay(new Date());
    let incompleteActivities: ProgramDay[] = [];

    Object.entries(programData).forEach(
      ([weekKey, week]: [string, ProgramDay[]]) => {
        const weekNumber = parseInt(weekKey.replace("week", "")); // Extract the week number from the key

        week.forEach((programDay: ProgramDay) => {
          const date: Date = getDateFromWeekAndDay(
            programDay.weekday,
            weekNumber,
            currentYear
          );

          // Check if the activity is not completed and the calculated date is in the past
          if (!programDay.completed && date < today) {
            incompleteActivities.push({
              ...programDay,
              date: date.toISOString(), // Optionally attach the calculated date to the programDay
            });
          }
        });
      }
    );

    return incompleteActivities;
  };

  const getDateFromWeekAndDay = (
    day: string,
    week: number,
    year: number
  ): Date => {
    const dayOffsets: { [key: string]: number } = {
      MONDAY: 0,
      TUESDAY: 1,
      WEDNESDAY: 2,
      THURSDAY: 3,
      FRIDAY: 4,
      SATURDAY: 5,
      SUNDAY: 6,
    };

    // Get the first day of the year
    const firstDayOfYear = startOfYear(new Date(year, 0, 1));
    // Get the start of the first ISO week
    let startOfFirstWeek = startOfWeek(firstDayOfYear, { weekStartsOn: 1 });

    // Adjust if the first week of the year does not count as the first ISO week
    if (getISOWeek(startOfFirstWeek) !== 1) {
      startOfFirstWeek = addWeeks(startOfFirstWeek, 1);
    }

    // Set to the correct ISO week
    const weekDayMon = addWeeks(startOfFirstWeek, week - 1);

    // Calculate the day offset using the map
    const dayOffset = dayOffsets[day.toUpperCase()]; // Get offset directly from the map

    // Calculate the date by adding the dayOffset to the Monday of the week
    return addDays(weekDayMon, dayOffset);
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
