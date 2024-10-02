import {Injectable} from "@angular/core";
import moment from "moment";

import {CalendarItemModel} from "../models/calendar-item.model";

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private readonly weekdaysShort = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  public createCalendarForYear(date: moment.Moment) {
    return Array.from({length: 12}, (_, i) =>
      this.createCalendar(date.clone().month(i))
    );
  }

  public createCalendar(month: moment.Moment): CalendarItemModel[][] {
    const daysInMonth = month.daysInMonth();
    const daysBefore = this.weekdaysShort.indexOf(month.startOf('months').format('ddd'));
    const daysAfter = this.weekdaysShort.length - 1 - this.weekdaysShort
      .indexOf(month.endOf('months').format('ddd'));
    const calendar: CalendarItemModel[] = [];
    const clone = month.startOf('months').clone().subtract(daysBefore, 'days');
    const totalDays = daysBefore + daysInMonth + daysAfter;

    for (let i = 0; i < totalDays; i++) {
      const isOutsideMonth = i < daysBefore || i >= daysBefore + daysInMonth;
      calendar.push(this.createCalendarItem(clone, isOutsideMonth));
      clone.add(1, 'days');
    }

    return this.splitCalendarForWeeksArr(calendar);
  }

  private splitCalendarForWeeksArr(calendar: CalendarItemModel[]) {
    return calendar.reduce((pre: CalendarItemModel[][], curr: CalendarItemModel) => {
      if (pre[pre.length - 1].length < this.weekdaysShort.length) {
        pre[pre.length - 1].push(curr);
      } else {
        pre.push([curr]);
      }
      return pre;
    }, [[]]);
  }

  private createCalendarItem(data: moment.Moment, disabled: boolean): CalendarItemModel {
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
