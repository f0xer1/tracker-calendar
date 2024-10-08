import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideNativeDateAdapter} from "@angular/material/core";
import {provideAnimations} from "@angular/platform-browser/animations";
import {provideRouter} from '@angular/router';
import {provideStore} from '@ngrx/store';

import {routes} from './app.routes';
import {absenceReducer} from "./store/absence.reducer";

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),
    provideAnimations(), provideNativeDateAdapter(),  provideStore({ absences: absenceReducer })]
};
