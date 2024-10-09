import {createSelector} from "@ngrx/store";

import {AppState} from "../app.state";
import {AbsenceState} from "./absence.state";

export const selectFeature = (state: AppState) => state.absences;

export const allAbsenceSelector = createSelector(
  selectFeature,
  (state: AbsenceState) => state.absence
);
export const sickAndVacationCountSelector = createSelector(
  selectFeature,
  (state: AbsenceState) => ({
    sickCount: state.sickCount,
    vacationCount: state.vacationCount
  })
);
