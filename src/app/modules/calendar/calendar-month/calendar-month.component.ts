import {NgClass, NgForOf, NgIf} from "@angular/common";
import {Component, OnInit} from '@angular/core';
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatToolbar, MatToolbarRow} from "@angular/material/toolbar";
import moment from "moment";
import {BehaviorSubject} from "rxjs";

import {CalendarItem} from "../../../models/calendar.item.model";
import {CalendarService} from "../../../services/calendar.service";

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

  constructor(private calendarService: CalendarService) {
  }

  ngOnInit(): void {
    this.currentDate = this.calendarService.getCurrentDate();
    this.calendar = this.calendarService.createCalendar();
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
}
