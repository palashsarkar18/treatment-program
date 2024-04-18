/**
 * Validates the structure and constraints of a treatment program.
 * 
 * @param program The treatment program object to be validated.
 * @returns An object indicating whether the program is valid and an error message if it is not.
 */
export const isValidTreatmentProgram = (program: any, currentDate: Date = new Date()): { isValid: boolean; errorMessage?: string } => {
    // Check if the program is an object and not null.
    if (typeof program !== 'object' || program === null) {
        return { isValid: false, errorMessage: "Program must be a non-null object." };
    }

    // Check if the program contains exactly three weeks.
    const keys = Object.keys(program);
    if (keys.length !== 3) {
        return { isValid: false, errorMessage: "Program must contain exactly three weeks." };
    }

    // Check for consecutive week numbers starting from the first full week.
    const weekNumbers = keys.map(key => parseInt(key.replace("week", ""), 10)).sort((a, b) => a - b);
    if (!weekNumbers.every((num, i, arr) => i === 0 || num === arr[i - 1] + 1)) {
        return { isValid: false, errorMessage: "Week numbers must be consecutive." };
    }

    for (const key of keys) {
        const activities = program[key];

        // Validate the structure of each week.
        if (!Array.isArray(activities) || !activities.every(activity => 
            ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'].includes(activity.weekday)
            && typeof activity.title === 'string'
            && typeof activity.completed === 'boolean')) {
            return { isValid: false, errorMessage: `Invalid activities structure in ${key}.` };
        }

        // Validate that future activities should always have activity.completed as false
        currentDate.setHours(0, 0, 0, 0); // Normalize current date to start of day

        const weekNumber = parseInt(key.replace("week", ""), 10); // 10, specifies the base (radix) for the conversion, indicating that the number is in base-10 (decimal)

        for (const activity of activities) {

            // Use helper function to calculate the date for the activity
            const activityDate = getDateFromWeek(weekNumber, activity.weekday, currentDate.getFullYear());
            if (activityDate > currentDate && activity.completed) {
                return {
                isValid: false,
                errorMessage: `Future activity in ${key} should not be marked as completed.`,
                };
            }
        }        
    }

    // If all checks pass, return valid.
    return { isValid: true };
}

/**
 * Calculates the date given a week number and weekday within a specific year.
 * 
 * @param weekNumber The ISO week number.
 * @param weekday The name of the day (e.g., "MONDAY").
 * @param year The year to calculate the date in.
 * @returns A Date object representing the specified weekday in the specified week of the specified year.
 */
const getDateFromWeek = (weekNumber: number, weekday: string, year: number): Date => {
    const firstDayOfYear = new Date(year, 0, 1);
    const days = (weekNumber - 1) * 7 + ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"].indexOf(weekday);
    // Calculate the date of the given weekday on the given week number
    return new Date(firstDayOfYear.setDate(firstDayOfYear.getDate() + days - firstDayOfYear.getDay()));
}
