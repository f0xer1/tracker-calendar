import {NgClass, NgForOf, NgIf} from "@angular/common";
import {Component, OnInit} from '@angular/core';
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatOption} from "@angular/material/core";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatSelect} from "@angular/material/select";
import {MatToolbarRow} from "@angular/material/toolbar";
import moment from "moment";
import {BehaviorSubject} from "rxjs";

import {CalendarItem} from "../../../models/calendar.item.model";
import {CalendarService} from "../../../services/calendar.service";
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

  constructor(private calendarService: CalendarService) {
  }

  ngOnInit(): void {
    this.currentDate = this.calendarService.getCurrentDate();
    this.calendar = this.calendarService.createCalendarForYear();
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
}
