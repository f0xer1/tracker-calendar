import {DestroyRef, Injectable} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {select, Store} from "@ngrx/store";
import moment from "moment";
import {BehaviorSubject} from "rxjs";

import {AppState} from "../app.state";
import {Absence} from "../models/absence.model";
import {CalendarItem} from "../models/calendar.item.model";
import {selectAllAbsences} from "../store/absence.selectors";
import {AbsenceState} from "../store/absence.state";

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private absenceList: AbsenceState[] = [];
  private readonly weekdaysShort = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  public currentDate = new BehaviorSubject<moment.Moment>(moment());

  constructor(private destroyRef: DestroyRef, private store: Store<AppState>) {
    this.store.pipe(select(selectAllAbsences), takeUntilDestroyed(this.destroyRef)).subscribe(
      (absence: AbsenceState[]) => {
        this.absenceList = absence;
      }
    );
  }

  /*Work with date*/
  public setNextDate(date: moment.unitOfTime.DurationConstructor): void {
    const value = this.currentDate.value.add(1, date);
    this.currentDate.next(value);
  }

  public setPreviousDate(date: moment.unitOfTime.DurationConstructor): void {
    const value = this.currentDate.value.subtract(1, date);
    this.currentDate.next(value);
  }

  public setCurrentDate(): void {
    this.currentDate.value.set({year: moment().year(), month: moment().month()});
  }

  public setFirstMonth(): void {
    const value = this.currentDate.value.startOf('year').clone()
    this.currentDate.next(value);
  }

  public getCurrentDate(): BehaviorSubject<moment.Moment> {
    return this.currentDate;
  }

  public getAbsenceListForCurrentYear(): Absence[] {
    return this.absenceList.find(absence => absence.year === this.currentDate.value.year())?.absence || [];
  }

  /*Work with calendar*/

  public createCalendarForYear(): CalendarItem[][][] {
    return Array.from({length: 12}, (_, i) => {
        this.currentDate.next(this.currentDate.value.clone().month(i));
        return this.createCalendar()
      }
    );
  }

  createCalendarForMonth() {
    this.currentDate.next(this.currentDate.value.clone())
    return this.createCalendar();
  }

  private createCalendar(): CalendarItem[][] {
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
      calendar.push(this.createCalendarItem(clone, isOutsideMonth, this.getAbsenceListForCurrentYear()));
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
      dayByMoment: data.clone(),
      day: data.format('DD'),
      dayName,
      isCurrentDay: moment().format('L') === data.format('L'),
      isCurrentMonth: moment().format("YYYY MMM") === data.format("YYYY MMM"),
      disabled: disabled,
      absence: absenceList.find(absence =>
        data.isBetween(absence.start, absence.end, null, '[]')
      ),
    }
  }
}
