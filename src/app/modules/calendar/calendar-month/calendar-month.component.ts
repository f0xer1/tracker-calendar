import {NgClass, NgForOf, NgIf} from "@angular/common";
import {Component, DestroyRef, OnInit} from '@angular/core';
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatDialog} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatToolbar, MatToolbarRow} from "@angular/material/toolbar";
import {select, Store} from "@ngrx/store";
import moment from "moment";
import {BehaviorSubject} from "rxjs";

import {AppState} from "../../../app.state";
import {Absence, AbsenceFormData, AbsenceType} from "../../../models/absence.model";
import {CalendarItem} from "../../../models/calendar.item.model";
import {CalendarService} from "../../../services/calendar.service";
import {selectAllAbsences} from "../../../store/absence.selectors";
import {AbsenceFormComponent} from "../../forms/absence-form/absence-form.component";

@Component({
  selector: 'app-calendar-month',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    NgClass,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatToolbarRow, MatToolbar, MatIcon, MatIconButton, MatButton
  ],
  templateUrl: './calendar-month.component.html',
  styleUrl: './calendar-month.component.css'
})
export class CalendarMonthComponent implements OnInit {
  currentDate!: BehaviorSubject<moment.Moment>;
  calendar: CalendarItem[][] = [];
  daysOfWeekArray: string[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  protected readonly AbsenceType = AbsenceType;

  constructor(private destroyRef: DestroyRef, private calendarService: CalendarService, private store: Store<AppState>, public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.currentDate = this.calendarService.getCurrentDate();
    this.store.pipe(select(selectAllAbsences), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
          this.getSelectedMonth();
        }
      );
  }

  getNextMonth() {
    this.calendarService.setNextDate('months');
    this.calendar = this.calendarService.createCalendarForMonth();
  }

  getPreviousMonth() {
    this.calendarService.setPreviousDate('months');
    this.calendar = this.calendarService.createCalendarForMonth();
  }

  getCurrentMonth() {
    this.calendarService.setCurrentDate();
    this.calendar = this.calendarService.createCalendarForMonth();
  }

  getSelectedMonth() {
    this.calendar = this.calendarService.createCalendarForMonth();
  }


  handleAbsenceDayClick(day: CalendarItem) {
    const isUpdating = !!day.absence;

    const absence: Absence = isUpdating
      ? day.absence as Absence
      : {
        id: -1,
        start: day.dayByMoment,
        end: day.dayByMoment,
        type: AbsenceType.Vacation,
        comment: ""
      };

    const transferData: AbsenceFormData = {absence, update: isUpdating};

    this.dialog.open(AbsenceFormComponent, {
      width: '500px',
      data: {transferData}
    });
  }

}
