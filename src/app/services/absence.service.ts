import {Injectable} from "@angular/core";
import moment from "moment";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AbsenceService {

  private idSubject = new BehaviorSubject<number>(1);

  public generateId = () => {
    const id = this.idSubject.value;
    this.idSubject.next(id + 1);
    return id;
  };

  toCountDaysRequested(start: moment.Moment, end: moment.Moment): number {
    return end.diff(start, 'days') + 1;
  }
}
