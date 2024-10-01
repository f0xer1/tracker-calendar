import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {CalendarMonthComponent} from "./modules/calendar/calendar-month/calendar-month.component";
import {HeaderComponent} from "./modules/header/header.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CalendarMonthComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'tracker-calendar';
}
