import {Injectable} from "@angular/core";
import moment from "moment";
import {CalendarItem} from "../models/CalendarItem";

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private readonly weekdaysShort = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  public createCalendarForYear(date: moment.Moment) {
    return Array.from({ length: 12 }, (_, i) =>
      this.createCalendar(date.clone().month(i))
    );
  }

  public createCalendar(month: moment.Moment): Array<CalendarItem[]> {
    const daysInMonth = month.daysInMonth();
    const daysBefore = this.weekdaysShort.indexOf(month.startOf('months').format('ddd'));
    const daysAfter = this.weekdaysShort.length - 1 - this.weekdaysShort
      .indexOf(month.endOf('months').format('ddd'));

    const calendar: CalendarItem[] = [];
    const clone = month.startOf('months').clone().subtract(daysBefore, 'days');

    for (let i = 0; i < daysBefore; i++) {
      calendar.push(this.createCalendarItem(clone, true));
      clone.add(1, 'days');
    }
    for (let i = 0; i < daysInMonth; i++) {
      calendar.push(this.createCalendarItem(clone, false));
      clone.add(1, 'days');
    }
    for (let i = 0; i < daysAfter; i++) {
      calendar.push(this.createCalendarItem(clone, true));
      clone.add(1, 'days');
    }
    return calendar.reduce((pre: Array<CalendarItem[]>, curr: CalendarItem) => {
      if (pre[pre.length - 1].length < this.weekdaysShort.length) {
        pre[pre.length - 1].push(curr);
      } else {
        pre.push([curr]);
      }
      return pre;
    }, [[]]);
  }

  private createCalendarItem(data: moment.Moment, disabled: boolean): CalendarItem {
    const dayName = data.format('ddd');
    return {
      day: data.format('DD'),
      dayName,
      isCurrentDay: moment().format('L') === data.format('L'),
      isCurrentMonth: moment().month() === data.month(),
      disabled: disabled,
    };
  }
}
