import {createSelector} from "@ngrx/store";

import {AppState} from "../app.state";
import {CountsAbsenceInterface} from "../models/absence.model";
import {AbsenceState} from "./absence.state";

export const selectFeature = (state: AppState) => state.absences;

export const selectAllAbsenceByYear = (year: number) =>
  createSelector(
    selectFeature,
    (state: AbsenceState[]) => {
      return state.find(absence => absence.year === year)?.absence || []
    }
  );
export const selectAll =
  createSelector(
    selectFeature,
    (state: AbsenceState[]) => {
      return state
    }
  );
export const selectSickAndVacationCountByYear = (year: number) => createSelector(
  selectFeature,
  (state: AbsenceState[]) => {
    const currentState = state.find(absence => absence.year === year);
    let countState: CountsAbsenceInterface;
    if (currentState) {
      countState = {
        sickCount: currentState.sickCount,
        vacationCount: currentState.vacationCount
      }
      return countState;
    } else {
      countState = {
        sickCount: 0,
        vacationCount: 0
      }
      return countState;
    }
  }
);
