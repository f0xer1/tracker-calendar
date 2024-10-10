import moment from "moment";

export interface Absence {
  id: number;
  start: moment.Moment;
  end: moment.Moment;
  type: AbsenceType;
  comment: string;
}

export enum AbsenceType {
  Sick = 'sick',
  Vacation = 'vacation',
}

export interface AbsenceFormData {
  absence: Absence;
  update: boolean;
}

export const MAX_COUNT_OF_ABSENCE = 10;

export interface CountsAbsenceInterface {
  sickCount: number,
  vacationCount: number
}

export interface BusyDatesAbsenceInterface {
  start: moment.Moment,
  end: moment.Moment
}

