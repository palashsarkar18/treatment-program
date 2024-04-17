/**
 * Validates the structure and constraints of a treatment program.
 * 
 * @param program The treatment program object to be validated.
 * @returns An object indicating whether the program is valid and an error message if it is not.
 */
export const isValidTreatmentProgram = (program: any): { isValid: boolean; errorMessage?: string } => {
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

    // Validate the structure of each week.
    for (const key of keys) {
        const activities = program[key];
        if (!Array.isArray(activities) || !activities.every(activity => 
            ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'].includes(activity.weekday)
            && typeof activity.title === 'string'
            && typeof activity.completed === 'boolean')) {
            return { isValid: false, errorMessage: `Invalid activities structure in ${key}.` };
        }
    }

    // If all checks pass, return valid.
    return { isValid: true };
}
