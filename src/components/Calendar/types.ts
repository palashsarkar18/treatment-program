export interface ProgramDay {
  weekday: string;
  title: string;
  completed: boolean;
}

export type ProgramWeek = ProgramDay[];

export interface ProgramData {
  [key: string]: ProgramWeek;
}
