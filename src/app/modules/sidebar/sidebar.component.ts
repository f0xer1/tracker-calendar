import {AsyncPipe} from "@angular/common";
import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit} from '@angular/core';
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatDialog} from "@angular/material/dialog";
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from "@angular/material/expansion";
import {MatIcon} from "@angular/material/icon";
import {MatList, MatListItem, MatNavList} from "@angular/material/list";
import {
  MatDrawer,
  MatDrawerContainer,
  MatSidenav,
  MatSidenavContainer,
  MatSidenavContent
} from "@angular/material/sidenav";
import {MatToolbar} from "@angular/material/toolbar";
import {RouterOutlet} from "@angular/router";
import {select, Store} from "@ngrx/store";
import moment from "moment";
import {BehaviorSubject, switchMap} from "rxjs";

import {AppState} from "../../app.state";
import {CountsAbsenceInterface} from "../../models/absence.model";
import {CalendarService} from "../../services/calendar.service";
import {selectSickAndVacationCountByYear} from "../../store/absence.selectors";
import {AbsenceFormComponent} from "../forms/absence-form/absence-form.component";


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    MatButton,
    MatExpansionPanelDescription,
    MatExpansionPanelTitle,
    MatExpansionPanelHeader,
    MatExpansionPanel,
    MatAccordion,
    MatListItem,
    MatList,
    AsyncPipe,
    MatToolbar,
    MatSidenavContent,
    MatSidenav,
    MatSidenavContainer,
    MatIcon,
    RouterOutlet,
    MatIconButton,
    MatDrawer,
    MatDrawerContainer,
    MatNavList
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent implements OnInit {
  currentDate!: BehaviorSubject<moment.Moment>;
  sidebarOpen = false;
  private destroyRef = inject(DestroyRef);
   counts: CountsAbsenceInterface = {
    sickCount: 0,
    vacationCount: 0
  };
  constructor(private calendarService: CalendarService, public dialog: MatDialog, private store: Store<AppState>) {
  }

  ngOnInit(): void {
    this.currentDate = this.calendarService.getCurrentDate();
    this.currentDate.pipe(
      switchMap(date =>
        this.store.pipe(select(selectSickAndVacationCountByYear(date.year())))
      ),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(
      (counts: CountsAbsenceInterface) => {
        this.counts = counts;
      }
    );
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  openCreationForm() {
    this.dialog.open(AbsenceFormComponent, {
      width: '500px',
    });
  }
}
