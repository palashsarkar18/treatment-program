import React from 'react';
import { format, getWeek } from "date-fns";
import "./Calendar.css"; // Make sure the path matches where you place your CSS file

import { ProgramDay, ProgramData } from "../../types/calendarTypes";
import {
  generateMonth,
  findIncompleteActivities,
} from "../../utils/calendarUtils";
import Day from "./Day";
import Weekdays from "./Weekdays";
import useSSE from '../../hooks/useSSE'; // Import the custom SSE hook


// TODO: Check validity of programData
// * Future events should always have "completed" as false.
// * There should be three consecutive weeks only.
// * The program should always start on the first full week of the month.
// Only one activity per day.

const Calendar: React.FC = () => {
  
  const { data: programData, error } = useSSE<ProgramData>('http://localhost:5000/events');

    if (error) {
        return <div>Error while fetching data!</div>;
    }

    if (!programData) {
        return <div>Loading...</div>;
    }

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  
  const renderDays = () => {
    const weeks = generateMonth();
    let incompleteActivities: ProgramDay[] | undefined;

    if (programData) {
      incompleteActivities = findIncompleteActivities(
        programData,
        new Date().getFullYear()
      ); // Get incomplete activities
    }

    // TODO: incompleteActivities has UTC tmezone. Make sure that it works correctly.
    // TODO: Make sure incompleteActivities is sorted in order of the date object.

    return (
      <tbody>
        {weeks.map((week, i) => (
          <tr className="row body" key={`week-${i}`}>
            {week.map((day) => (
              <Day
                key={format(day, "yyyy-MM-dd")}
                day={day}
                currentDate={currentDate}
                dayActivity={getDayActivity(day, incompleteActivities)}
              />
            ))}
          </tr>
        ))}
      </tbody>
    );
  };

  const getDayActivity = (
    day: Date,
    incompleteActivities: ProgramDay[] | undefined
  ): ProgramDay | undefined => {
    let dayActivity: ProgramDay | undefined;

    if (!programData) {
      return dayActivity;
    }

    const isFuture = day >= currentDate;

    console.log(
      `day: ${day} >= currentDate: ${currentDate} ? isFuture ${isFuture}`
    );

    const week: ProgramDay[] = programData[`week${getWeek(day)}`];

    //   console.log("incompleteActivities: ", incompleteActivities);

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
        } else if (
          isFuture &&
          incompleteActivities &&
          incompleteActivities.length > 0
        ) {
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

    return dayActivity;
  };

  return (
    <div className="calendar">
      <div className="header">
        <h1>Weekly Program</h1>
      </div>
      <table className="calendar-table">
        <Weekdays />
        {renderDays()}
      </table>
    </div>
  );
};

export default Calendar;
