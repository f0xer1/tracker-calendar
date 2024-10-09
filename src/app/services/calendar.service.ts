import {Injectable} from "@angular/core";
import moment from "moment";
import {BehaviorSubject} from "rxjs";

import {Absence} from "../models/absence.model";
import {CalendarItem} from "../models/calendar.item.model";

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  private readonly weekdaysShort = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  public currentDate = new BehaviorSubject<moment.Moment>(moment());

  /*Work with date*/
  public setNextDate(date: moment.unitOfTime.DurationConstructor) {
    const value = this.currentDate.value.add(1, date);
    this.currentDate.next(value);
  }

  public setPreviousDate(date: moment.unitOfTime.DurationConstructor) {
    const value = this.currentDate.value.subtract(1, date);
    this.currentDate.next(value);
  }

  public setCurrentDate() {
    this.currentDate.value.set({year: moment().year(), month: moment().month()});
  }

  public getCurrentDate(): BehaviorSubject<moment.Moment> {
    return this.currentDate;
  }

  /*Work with calendar*/

  public createCalendarForYear(absenceList: Absence[]): CalendarItem[][][] {
    return Array.from({length: 12}, (_, i) => {
        this.currentDate.next(this.currentDate.value.clone().month(i));
        return this.createCalendar(absenceList)
      }
    );
  }

  public createCalendar(absenceList: Absence[]): CalendarItem[][] {
    const now = this.currentDate.value;
    const daysInMonth = now.daysInMonth();
    const daysBefore = this.weekdaysShort.indexOf(now.startOf('months').format('ddd'));
    const daysAfter = this.weekdaysShort.length - 1 - this.weekdaysShort
      .indexOf(now.endOf('months').format('ddd'));
    const calendar: CalendarItem[] = [];
    const clone = now.startOf('months').clone().subtract(daysBefore, 'days');
    const totalDays = daysBefore + daysInMonth + daysAfter;

    for (let i = 0; i < totalDays; i++) {
      const isOutsideMonth = i < daysBefore || i >= daysBefore + daysInMonth;
      calendar.push(this.createCalendarItem(clone, isOutsideMonth, absenceList));
      clone.add(1, 'days');
    }
    return this.splitCalendarForWeeksArr(calendar);
  }

  private splitCalendarForWeeksArr(calendar: CalendarItem[]) {
    return calendar.reduce((pre: CalendarItem[][], curr: CalendarItem) => {
      if (pre[pre.length - 1].length < this.weekdaysShort.length) {
        pre[pre.length - 1].push(curr);
      } else {
        pre.push([curr]);
      }
      return pre;
    }, [[]]);
  }

  private createCalendarItem(data: moment.Moment, disabled: boolean, absenceList: Absence[]): CalendarItem {
    const dayName = data.format('ddd');
    return {
      day: data.format('DD'),
      dayName,
      isCurrentDay: moment().format('L') === data.format('L'),
      isCurrentMonth: moment().month() === data.month(),
      disabled: disabled,
      absence: absenceList.find(absence =>
        data.isBetween(absence.start, absence.end, null, '[]')
      )
    }
  }
}
