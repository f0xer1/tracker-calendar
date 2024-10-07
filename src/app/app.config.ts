import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideNativeDateAdapter} from "@angular/material/core";
import {provideAnimations} from "@angular/platform-browser/animations";
import {provideRouter} from '@angular/router';
import {provideStore} from '@ngrx/store';

import {routes} from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({eventCoalescing: true}), provideRouter(routes), provideAnimations(),
    provideStore(), provideNativeDateAdapter()]
};
