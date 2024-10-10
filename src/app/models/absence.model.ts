import moment from "moment";

export interface Absence {
  id: number;
  start: moment.Moment;
  end: moment.Moment;
  type: string;
  comment: string;
}
export interface CountsAbsenceInterface {
  sickCount: number,
  vacationCount: number
}

export interface BusyDatesAbsenceInterface {
  start: moment.Moment,
  end: moment.Moment
}

