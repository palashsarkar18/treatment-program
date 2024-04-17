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

export const getDayActivity = (
  calendarDay: Date,
  currentDate: Date,
  incompleteActivities: ProgramDay[] | undefined,
  programActivities: ProgramData | null
): ProgramDay | undefined => {

  // The calendar day is not for the same month. Hence dreturn undefined.
  if (calendarDay.getMonth() !== currentDate.getMonth()) {
    // console.log(`Returning nothing for ${calendarDay} because it is out of range`);
    return undefined;
  }

  // There is no program activity specified. Hence return undefined.
  if (!programActivities) {
    // console.log(`Returning nothing for ${calendarDay} because program activity is not specified`);
    return undefined;
  }

  const isFuture = calendarDay >= currentDate;

  // console.log(
  //   `day: ${calendarDay} >= currentDate: ${currentDate} ? isFuture ${isFuture}`
  // );

  const weekActivityOnCalendarDay: ProgramDay[] = programActivities[`week${getWeek(calendarDay)}`];

  // console.log("incompleteActivities: ", JSON.stringify(incompleteActivities));

  if (weekActivityOnCalendarDay) {
    const dayOfWeek = calendarDay.toLocaleString("en-US", { weekday: "long" }).toUpperCase();
    const dayActivity = weekActivityOnCalendarDay.find(pd => pd.weekday === dayOfWeek); // 'pd' is now correctly typed as ProgramDay

    if (dayActivity && !isFuture && dayActivity.completed) {
      // console.log(`Returning scheduled past and completed activity for ${calendarDay}:`, dayActivity);
      return dayActivity;
    } 

    if (dayActivity && isFuture) {
      // console.log(`Returning scheduled future activity for ${calendarDay}:`, dayActivity);
      return dayActivity;
    }
  }

  if (isFuture && incompleteActivities && incompleteActivities.length > 0) {
    // console.log(`Returning incomplete for ${calendarDay}`);
    return incompleteActivities.shift();
  }

  // console.log(`Returning nothing for ${calendarDay}. Existing incompleteActivities`, incompleteActivities);
  return undefined;
};