import {NgClass, NgForOf, NgIf} from "@angular/common";
import {Component, DestroyRef, inject, OnInit} from '@angular/core';
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
import {CalendarItem} from "../../../models/calendar.item.model";
import {CalendarService} from "../../../services/calendar.service";
import {selectAll} from "../../../store/absence.selectors";
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
  private destroyRef = inject(DestroyRef);

  constructor(private calendarService: CalendarService, private store: Store<AppState>, public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.currentDate = this.calendarService.getCurrentDate();
    this.store.pipe(select(selectAll), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
          this.getCurrentMonth();
        }
      );
  }

  public getNextMonth() {
    this.calendarService.setNextDate('months');
    this.calendar = this.calendarService.createCalendar();
  }

  public getPreviousMonth() {
    this.calendarService.setPreviousDate('months');
    this.calendar = this.calendarService.createCalendar();
  }

  public getCurrentMonth() {
    this.calendarService.setCurrentDate();
    this.calendar = this.calendarService.createCalendar();
  }

  handleSickDayClick(day: CalendarItem) {
    this.dialog.open(AbsenceFormComponent, {
      width: '500px',
      data: {absence: day.absence}
    });
  }
}
