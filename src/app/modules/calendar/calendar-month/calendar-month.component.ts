import {Component, OnInit} from '@angular/core';
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {CalendarService} from "../../../services/CalendarService";
import moment from "moment";
import {CalendarItem} from "../../../models/CalendarItem";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatToolbar, MatToolbarRow} from "@angular/material/toolbar";
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatIconButton} from "@angular/material/button";

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
  date: moment.Moment = moment();
  calendar: Array<CalendarItem[]> = [];

  constructor(private calendarService: CalendarService) {
  }

  ngOnInit(): void {
    this.calendar = this.calendarService.createCalendar(this.date);
  }

  public nextMonth() {
    this.date.add(1, 'months');
    this.calendar = this.calendarService.createCalendar(this.date);
  }

  public previousMonth() {
    this.date.subtract(1, 'months');
    this.calendar = this.calendarService.createCalendar(this.date);
  }

  public currentMonth() {
    this.date = moment();
    this.calendar = this.calendarService.createCalendar(this.date);
  }
}
