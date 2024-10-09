import {AbsenceState} from "./store/absence.state";

export interface AppState {
  readonly absences: AbsenceState;
}
