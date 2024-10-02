import {Component, OnInit} from '@angular/core';
import moment from "moment";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatOption} from "@angular/material/core";
import {MatSelect} from "@angular/material/select";
import {MatToolbarRow} from "@angular/material/toolbar";
import {CalendarService} from "../../../services/calendar.service";
import {CalendarItemModel} from "../../../models/calendar-item.model";

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
  currentData: moment.Moment = moment();
  calendar: CalendarItemModel[][][] = [];
  monthArr: string[] = moment.months();

  constructor(private calendarService: CalendarService) {
  }

  ngOnInit(): void {
    this.calendar = this.calendarService.createCalendarForYear(this.currentData);
  }

  nextYear() {
    this.currentData.add(1, 'year');
    this.calendar = this.calendarService.createCalendarForYear(this.currentData);
  }

  previousYear() {
    this.currentData.subtract(1, 'year');
    this.calendar = this.calendarService.createCalendarForYear(this.currentData);
  }

  currentYear() {
    this.currentData = moment();
    this.calendar = this.calendarService.createCalendarForYear(this.currentData);
  }
}
