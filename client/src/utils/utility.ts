/**
 * This module contains utility functions related to date manipulations and calendar operations,
 * specifically designed to support the Calendar component in managing and displaying dates
 * and scheduled activities.
 */

import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  startOfDay,
  startOfYear,
  addWeeks,
  getISOWeek,
  getWeek
} from "date-fns";

import { ProgramDay, ProgramData } from "../types/calendarTypes"; // Adjust the path as necessary

/**
 * Generates an array of weeks for the current month, with each week represented as an array of `Date` objects.
 * This helps in displaying a full calendar month view starting from Monday.
 * @returns {Date[][]} An array of week arrays, each containing Date objects for each day of the week.
 */
export const generateMonth = () => {
  const currentDate: Date = new Date();
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

/**
 * Finds incomplete activities from the program data based on the current date.
 * @param {Date} currentDate - The current date to compare against activity dates.
 * @param {ProgramData} programData - The data structure containing weeks and their respective activities.
 * @returns {ProgramDay[]} An array of activities that are past due and not completed.
 */
export const findIncompleteActivities = (
  currentDate: Date,
  programData: ProgramData
): ProgramDay[] => {
  const today = startOfDay(currentDate);
  const incompleteActivities: ProgramDay[] = [];

  Object.entries(programData).forEach(
    ([weekKey, week]: [string, ProgramDay[]]) => {
      const weekNumber = parseInt(weekKey.replace("week", "")); // Extract the week number from the key
      week.forEach((programDay: ProgramDay) => {
        const date: Date = getDateFromWeekAndDay(
          programDay.weekday,
          weekNumber,
          currentDate.getFullYear()
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

/**
 * Calculates the specific Date for a given weekday in a specified ISO week and year.
 * @param {string} day - The weekday to calculate the date for (e.g., "MONDAY").
 * @param {number} week - The ISO week number.
 * @param {year} year - The year for which the date is calculated.
 * @returns {Date} The calculated date.
 */
export const getDateFromWeekAndDay = (
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

/**
 * Determines the activity data for a specific calendar day.
 * @param {Date} calendarDay - The calendar day to check activities for.
 * @param {Date} currentDate - The current date to determine if the calendar day is in the future.
 * @param {ProgramDay[] | undefined} incompleteActivities - List of activities that are not completed.
 * @param {ProgramData | null} programActivities - The structured data of program activities by weeks.
 * @returns {ProgramDay | undefined} The activity for the given day if it exists, or undefined.
 */
export const getDayActivity = (
  calendarDay: Date,
  currentDate: Date,
  incompleteActivities: ProgramDay[] | undefined,
  programActivities: ProgramData | null
): ProgramDay | undefined => {

  // The calendar day is not for the same month. Hence return undefined.
  if (calendarDay.getMonth() !== currentDate.getMonth()) {
    return undefined;
  }

  // There is no program activity specified. Hence return undefined.
  if (!programActivities) {
    return undefined;
  }

  const isFuture = calendarDay >= currentDate;

  const weekActivityOnCalendarDay: ProgramDay[] = programActivities[`week${getWeek(calendarDay)}`];

  if (weekActivityOnCalendarDay) {
    const dayOfWeek = calendarDay.toLocaleString("en-US", { weekday: "long" }).toUpperCase();
    const dayActivity = weekActivityOnCalendarDay.find(pd => pd.weekday === dayOfWeek); // 'pd' is now correctly typed as ProgramDay

    if (dayActivity && !isFuture && dayActivity.completed) {
      return dayActivity;
    } 

    if (dayActivity && isFuture) {
      return dayActivity;
    }
  }

  if (isFuture && incompleteActivities && incompleteActivities.length > 0) {
    return incompleteActivities.shift();
  }

  return undefined;
};