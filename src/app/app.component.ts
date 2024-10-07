import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import {CalendarMonthComponent} from "./modules/calendar/calendar-month/calendar-month.component";
import {AbsenceFormComponent} from "./modules/forms/absence-form/absence-form.component";
import {HeaderComponent} from "./modules/header/header.component";
import {SidebarComponent} from "./modules/sidebar/sidebar.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CalendarMonthComponent, HeaderComponent, SidebarComponent, AbsenceFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'tracker-calendar';
}
