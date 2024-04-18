import React from 'react';
import { format } from "date-fns";
import "./Calendar.css"; 
import { ProgramDay, ProgramData } from "../types/calendarTypes";
import {
  generateMonth,
  findIncompleteActivities,
  getDayActivity,
} from "../utils/utility";
import Day from "./Day";
import Weekdays from "./Weekdays";
import { useSSE } from '../hooks/useSSE'; // Importing the custom SSE hook for real-time data

/**
 * Calendar Component
 * 
 * Renders a monthly calendar view that interacts with real-time data using Server-Sent Events (SSE).
 * It displays days, weeks, and the activities scheduled for each day as fetched from the server.
 *
 * The component handles data fetching, error states, and date calculations internally,
 * providing a comprehensive view of scheduled programs.
 */
const Calendar: React.FC = () => {
  // Construct the URL for fetching events data based on environment configuration
  const apiBaseUrl: string = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL : 'http://localhost:5000';
  const eventsUrl = `${apiBaseUrl}${process.env.REACT_APP_EVENTS_ENDPOINT}`;

  // Use the custom SSE hook to subscribe to real-time updates
  const { data: programData, error } = useSSE<ProgramData>(eventsUrl);

  // Initialize the current date and reset time to midnight
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  // Function to render days in the calendar using utility functions for date management
  const renderDays = () => {
    const weeks = generateMonth(); // Generate the entire month's week structure
    let incompleteActivities: ProgramDay[] | undefined;

    if (programData) {
      incompleteActivities = findIncompleteActivities(currentDate, programData);
    }

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

  // Handle error states and loading conditions
  if (error) {
    return <div>Error while fetching data!</div>;
  }

  // Default render of the calendar with or without data
  return (
    <div className="calendar">
      <div className="header">
        <h1>Weekly Program</h1>
      </div>
      <table className="calendar-table">
        <Weekdays currentDate={currentDate} /> {/* Display weekday headers */}
        {renderDays()} {/* Render the calendar grid with activities */}
      </table>
    </div>
  );
};

export default Calendar;
