export interface ProgramDay {
  weekday: string;
  title: string;
  completed: boolean;
  date?: string;
}

// export type ProgramWeek = ProgramDay[];

export interface ProgramData {
  [key: string]: ProgramDay[];
}
