import {NgClass, NgForOf, NgIf} from "@angular/common";
import {Component, OnInit} from '@angular/core';
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatToolbar, MatToolbarRow} from "@angular/material/toolbar";
import moment from "moment";

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
  providers: [CalendarService],
  templateUrl: './calendar-month.component.html',
  styleUrl: './calendar-month.component.css'
})
export class CalendarMonthComponent implements OnInit {
  currentDate: moment.Moment = moment();
  calendar: CalendarItem[][] = [];
  daysOfWeekArray: string[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  constructor(private calendarService: CalendarService) {
  }

  ngOnInit(): void {
    this.calendar = this.calendarService.createCalendar(this.currentDate);
  }

  public nextMonth() {
    this.currentDate.add(1, 'months');
    this.calendar = this.calendarService.createCalendar(this.currentDate);
  }

  public previousMonth() {
    this.currentDate.subtract(1, 'months');
    this.calendar = this.calendarService.createCalendar(this.currentDate);
  }

  public currentMonth() {
    this.currentDate = moment();
    this.calendar = this.calendarService.createCalendar(this.currentDate);
  }
}
