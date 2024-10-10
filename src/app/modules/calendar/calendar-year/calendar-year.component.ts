import {NgClass, NgForOf, NgIf} from "@angular/common";
import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatOption} from "@angular/material/core";
import {MatDialog} from "@angular/material/dialog";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatSelect} from "@angular/material/select";
import {MatToolbarRow} from "@angular/material/toolbar";
import {select, Store} from "@ngrx/store";
import moment from "moment";
import {BehaviorSubject} from "rxjs";

import {AppState} from "../../../app.state";
import {CalendarItem} from "../../../models/calendar.item.model";
import {CalendarService} from "../../../services/calendar.service";
import {selectAll} from "../../../store/absence.selectors";
import {AbsenceFormComponent} from "../../forms/absence-form/absence-form.component";
import {SidebarComponent} from "../../sidebar/sidebar.component";

@Component({
  selector: 'app-calendar-year',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    NgClass,
    MatButton,
    MatFormField,
    MatIcon,
    MatIconButton,
    MatLabel,
    MatOption,
    MatSelect,
    MatToolbarRow,
    SidebarComponent
  ],
  templateUrl: './calendar-year.component.html',
  styleUrl: './calendar-year.component.css'
})
export class CalendarYearComponent implements OnInit {
  currentDate!: BehaviorSubject<moment.Moment>;
  calendar: CalendarItem[][][] = [];
  monthList: string[] = moment.months();
  private destroyRef = inject(DestroyRef);

  constructor(private calendarService: CalendarService, private store: Store<AppState>, public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.currentDate = this.calendarService.getCurrentDate();
    this.store.pipe(select(selectAll), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
          this.getSelectedYear();
        }
      );
  }

  getNextYear() {
    this.calendarService.setNextDate('year');
    this.calendar = this.calendarService.createCalendarForYear();
  }

  getPreviousYear() {
    this.calendarService.setPreviousDate('year');
    this.calendar = this.calendarService.createCalendarForYear();
  }

  getCurrentYear() {
    this.calendarService.setCurrentDate();
    this.calendar = this.calendarService.createCalendarForYear();
  }

  getSelectedYear() {
    this.calendar = this.calendarService.createCalendarForYear();
  }

  handleSickDayClick(day: CalendarItem) {
    this.dialog.open(AbsenceFormComponent, {
      width: '500px',
      data: {absence: day.absence}
    });
  }
}
