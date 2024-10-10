import {Absence} from "../models/absence.model";

export interface AbsenceState {
  readonly year: number;
  readonly absence: Absence[]
  readonly sickCount: number
  readonly vacationCount: number
}
