import {NgClass, NgForOf, NgIf} from "@angular/common";
import {Component, OnInit} from '@angular/core';
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatOption} from "@angular/material/core";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatSelect} from "@angular/material/select";
import {MatToolbarRow} from "@angular/material/toolbar";
import moment from "moment";

import {CalendarItem} from "../../../models/calendar.item.model";
import {CalendarService} from "../../../services/calendar.service";

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
    MatToolbarRow
  ],
  providers: [CalendarService],
  templateUrl: './calendar-year.component.html',
  styleUrl: './calendar-year.component.css'
})
export class CalendarYearComponent implements OnInit {
  currentDate: moment.Moment = moment();
  calendar: CalendarItem[][][] = [];
  monthList: string[] = moment.months();

  constructor(private calendarService: CalendarService) {
  }

  ngOnInit(): void {
    this.calendar = this.calendarService.createCalendarForYear(this.currentDate);
  }

  nextYear() {
    this.currentDate.add(1, 'year');
    this.calendar = this.calendarService.createCalendarForYear(this.currentDate);
  }

  previousYear() {
    this.currentDate.subtract(1, 'year');
    this.calendar = this.calendarService.createCalendarForYear(this.currentDate);
  }

  currentYear() {
    this.currentDate = moment();
    this.calendar = this.calendarService.createCalendarForYear(this.currentDate);
  }
}
