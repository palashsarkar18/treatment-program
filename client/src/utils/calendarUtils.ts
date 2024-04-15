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
} from "date-fns";

import { ProgramDay, ProgramData } from "../types/calendarTypes"; // Adjust the path as necessary

// This function creates the dates for the entire month, grouped by week
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

export const findIncompleteActivities = (
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
