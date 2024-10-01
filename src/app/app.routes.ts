import { Routes } from '@angular/router';

export const routes:  Routes = [
  {
    path: 'app-calendar-month',
    loadComponent: () => import('./modules/calendar/calendar-month/calendar-month.component').then(m => m.CalendarMonthComponent),
  },
  {
    path: 'app-calendar-year',
    loadComponent: () => import('./modules/calendar/calendar-year/calendar-year.component').then(m => m.CalendarYearComponent),
  },
  {
    path: '',
    redirectTo: 'app-calendar-month',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'app-calendar-month'
  }
];
