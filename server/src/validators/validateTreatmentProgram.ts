import { startOfMonth, addDays, startOfWeek, getISOWeek } from 'date-fns';

/**
 * Validates the structure and constraints of a treatment program.
 * 
 * @param program The treatment program object to be validated.
 * @param currentDate The current date used for reference.
 * @returns An object indicating whether the program is valid and an error message if it is not.
 */
export const isValidTreatmentProgram = (program: any, currentDate: Date = new Date()): { isValid: boolean; errorMessage?: string } => {
    if (typeof program !== 'object' || program === null) {
        return { isValid: false, errorMessage: "Program must be a non-null object." };
    }

    const keys = Object.keys(program);
    if (keys.length !== 3) {
        return { isValid: false, errorMessage: "Program must contain exactly three weeks." };
    }

    const sortedWeekNumbers = keys.map(key => parseInt(key.replace("week", ""), 10)).sort((a, b) => a - b);
    const firstWeekNumber = sortedWeekNumbers[0]; // Smallest week number
    const year = currentDate.getFullYear();

    // Calculate the starting date of the first week
    const firstWeekStartDate = getDateFromISOWeek(firstWeekNumber, year);
    const monthStart = startOfMonth(firstWeekStartDate);
    const firstFullWeekStart = startOfWeek(monthStart, { weekStartsOn: 1 });

    // Validate first full week
    if (getISOWeek(firstFullWeekStart) !== getISOWeek(firstWeekStartDate)) {
        return { isValid: false, errorMessage: "The first week does not start on the first full week of its month." };
    }

    if (!sortedWeekNumbers.every((num, i, arr) => i === 0 || num === arr[i - 1] + 1)) {
        return { isValid: false, errorMessage: "Week numbers must be consecutive." };
    }

    for (const key of keys) {
        const activities = program[key];
        if (!Array.isArray(activities) || !activities.every(activity => 
            ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'].includes(activity.weekday)
            && typeof activity.title === 'string'
            && typeof activity.completed === 'boolean')) {
            return { isValid: false, errorMessage: `Invalid activities structure in ${key}.` };
        }

        const weekNumber = parseInt(key.replace("week", ""), 10);
        for (const activity of activities) {
            const activityDate = getDateFromISOWeek(weekNumber, year, activity.weekday);
            if (activityDate > currentDate && activity.completed) {
                return { isValid: false, errorMessage: `Future activity in ${key} should not be marked as completed.` };
            }
        }        
    }

    return { isValid: true };
}

/**
 * Calculates the date given a week number, weekday, and year.
 * 
 * @param weekNumber The ISO week number.
 * @param year The year to calculate the week's start date.
 * @param weekday The day of the week (optional, defaults to Monday).
 * @returns A Date object representing the start of the specified week or a specific weekday in that week.
 */
function getDateFromISOWeek(weekNumber: number, year: number, weekday: string = "MONDAY"): Date {
    const simple = new Date(year, 0, 1 + (weekNumber - 1) * 7);
    const dow = simple.getDay();
    const ISOweekStart = simple;
    if (dow <= 4)
        ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
    else
        ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());

    const dayOffsets: { [key: string]: number } = {
        MONDAY: 0,
        TUESDAY: 1,
        WEDNESDAY: 2,
        THURSDAY: 3,
        FRIDAY: 4,
        SATURDAY: 5,
        SUNDAY: 6,
    };

    // Adjust the start day to the specific weekday
    return addDays(ISOweekStart, dayOffsets[weekday]);
}
