import moment from "moment";

import {Absence} from "./absence.model";

export interface CalendarItem {
  day: string;
  dayName: string;
  isCurrentDay: boolean;
  isCurrentMonth: boolean;
  disabled: boolean;
  absence: Absence | undefined;
  dayByMoment: moment.Moment;
}
