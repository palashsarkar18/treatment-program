import React from 'react';
import { format } from "date-fns";
import "./Calendar.css"; // Make sure the path matches where you place your CSS file

import { ProgramDay, ProgramData } from "../../types/calendarTypes";
import {
  generateMonth,
  findIncompleteActivities,
  getDayActivity,
} from "../../utils/utility";
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

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  // currentDate.setDate(currentDate.getDate() + 11); // TODO: Delete this.
  
  const renderDays = () => {
    const weeks = generateMonth();
    let incompleteActivities: ProgramDay[] | undefined;

    if (programData) {
      incompleteActivities = findIncompleteActivities(
        currentDate,
        programData
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
                dayActivity={getDayActivity(day, currentDate, incompleteActivities, programData)}
              />
            ))}
          </tr>
        ))}
      </tbody>
    );
  };

  if (error) {
    return <div>Error while fetching data!</div>;
  }

  if (!programData) {
    return (
      <div className="calendar">
        <div className="header">
          <h1>Weekly Program</h1>
        </div>
        <table className="calendar-table">
          <Weekdays currentDate={currentDate} />
          {renderDays()}
        </table>
      </div>
    );
  }

  return (
    <div className="calendar">
      <div className="header">
        <h1>Weekly Program</h1>
      </div>
      <table className="calendar-table">
        <Weekdays currentDate={currentDate} />
        {renderDays()}
      </table>
    </div>
  );
};

export default Calendar;
