import {Component, OnInit} from '@angular/core';
import {NgClass, NgForOf, NgIf} from "@angular/common";
import moment from "moment";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatToolbar, MatToolbarRow} from "@angular/material/toolbar";
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatIconButton} from "@angular/material/button";
import {CalendarService} from "../../../services/calendar.service";
import {CalendarItemModel} from "../../../models/calendar-item.model";

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
  currentData: moment.Moment = moment();
  calendar: CalendarItemModel[][] = [];
  daysOfWeekArray: string[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  constructor(private calendarService: CalendarService) {
  }

  ngOnInit(): void {
    this.calendar = this.calendarService.createCalendar(this.currentData);
  }

  public nextMonth() {
    this.currentData.add(1, 'months');
    this.calendar = this.calendarService.createCalendar(this.currentData);
  }

  public previousMonth() {
    this.currentData.subtract(1, 'months');
    this.calendar = this.calendarService.createCalendar(this.currentData);
  }

  public currentMonth() {
    this.currentData = moment();
    this.calendar = this.calendarService.createCalendar(this.currentData);
  }
}
