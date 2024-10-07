import {AsyncPipe} from "@angular/common";
import {Component, OnInit} from '@angular/core';
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
import moment from "moment";
import {BehaviorSubject} from "rxjs";

import {CalendarService} from "../../services/calendar.service";
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
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  currentDate!: BehaviorSubject<moment.Moment>;
  sidebarOpen = false;

  constructor(private calendarService: CalendarService, public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.currentDate = this.calendarService.getCurrentDate();
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
