import {Component, OnInit} from '@angular/core';
import {CalendarItem} from "../../../models/CalendarItem";
import {CalendarService} from "../../../services/CalendarService";
import moment from "moment";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatOption} from "@angular/material/core";
import {MatSelect} from "@angular/material/select";
import {MatToolbarRow} from "@angular/material/toolbar";

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
  date: moment.Moment = moment();
  calendar: Array<CalendarItem[][]> = [];
  monthArr: String[] = moment.months();

  constructor(private calendarService: CalendarService) {
  }

  ngOnInit(): void {
    this.calendar = this.calendarService.createCalendarForYear(this.date);
  }

  nextYear() {
    this.date.add(1, 'year');
    this.calendar = this.calendarService.createCalendarForYear(this.date);
  }

  previousYear() {
    this.date.subtract(1, 'year');
    this.calendar = this.calendarService.createCalendarForYear(this.date);
  }

  currentYear() {
    this.date = moment();
    this.calendar = this.calendarService.createCalendarForYear(this.date);
  }
}
