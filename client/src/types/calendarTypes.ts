/**
 * Represents a single day within a treatment program.
 */
export interface ProgramDay {
  /**
   * The day of the week for the program activity.
   */
  weekday:
    | "MONDAY"
    | "TUESDAY"
    | "WEDNESDAY"
    | "THURSDAY"
    | "FRIDAY"
    | "SATURDAY"
    | "SUNDAY";
  
  /**
   * The title of the activity scheduled for this day.
   */
  title: string;

  /**
   * Indicates whether the activity for the day has been completed.
   */
  completed: boolean;

  /**
   * The optional specific date of the activity (in a format like YYYY-MM-DD).
   * This can be useful for linking program days to actual calendar dates.
   */
  date?: string;
}

// This line was commented out and might be included in future for representing a week of program days.
// export type ProgramWeek = ProgramDay[];

/**
 * Defines the structure of the entire treatment program.
 * It uses a dynamic key which follows the pattern 'Weekn', where `n` is a number.
 */
export interface ProgramData {
  /**
   * Index signature to accommodate dynamically named keys representing each week,
   * such as 'Week1', 'Week2', ..., 'Week53'.
   * Each key maps to an array of `ProgramDay` objects representing all the days in that week.
   */
  [key: string]: ProgramDay[];
}
