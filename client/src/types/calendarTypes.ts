export interface ProgramDay {
  weekday:
    | "MONDAY"
    | "TUESDAY"
    | "WEDNESDAY"
    | "THURSDAY"
    | "FRIDAY"
    | "SATURDAY"
    | "SUNDAY";
  title: string;
  completed: boolean;
  date?: string;
}

// export type ProgramWeek = ProgramDay[];

export interface ProgramData {
  [key: string]: ProgramDay[];
}
