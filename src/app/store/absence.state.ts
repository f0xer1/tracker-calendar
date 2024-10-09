import {Absence} from "../models/absence.model";

export interface AbsenceState {
  readonly absence: Absence[]
  readonly sickCount: number
  readonly vacationCount: number
}
