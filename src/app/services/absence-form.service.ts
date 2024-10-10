import {Injectable} from "@angular/core";
import {Store} from "@ngrx/store";
import moment from "moment";
import {BehaviorSubject} from "rxjs";

import {AppState} from "../app.state";
import {Absence} from "../models/absence.model";
import {addAbsence, deleteAbsence, updateAbsence} from "../store/absence.action";

@Injectable({
  providedIn: 'root'
})
export class AbsenceFormService {
  constructor(
    private store: Store<AppState>,
  ) {}
  private idSubject = new BehaviorSubject<number>(1);

  public generateId = () => {
    const id = this.idSubject.value;
    this.idSubject.next(id + 1);
    return id;
  };

  toCountDaysRequested(start: moment.Moment, end: moment.Moment): number {
    return end.diff(start, 'days') + 1;
  }

  deleteAbsence(absence: Absence): void {
    this.store.dispatch(deleteAbsence({
      year: absence.end.year(),
      id: absence.id,
      daysRequested: this.toCountDaysRequested(absence.start, absence.end),
      absenceType: absence.type
    }));
  }

  createNewAbsence(absence: Absence): void {
    this.store.dispatch(addAbsence({
      year: absence.start.year(),
      absence,
      daysRequested: this.toCountDaysRequested(absence.start, absence.end),
      absenceType: absence.type
    }));
  }

  updateExistingAbsence(absence: Absence, previousAbsence: Absence): void {
    this.store.dispatch(updateAbsence({
      year: previousAbsence.start.year(),
      id: absence.id,
      changes: absence,
      daysBefore: this.toCountDaysRequested(previousAbsence.start, previousAbsence.end),
      daysAfter: this.toCountDaysRequested(absence.start, absence.end),
      from: previousAbsence.type,
      to: absence.type
    }));
  }

}
