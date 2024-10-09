import {createReducer, on} from "@ngrx/store";

import {addAbsence, deleteAbsence, updateAbsence} from "./absence.action";
import {AbsenceState} from "./absence.state";

export const initialState: AbsenceState = {
  absence: [],
  sickCount: 0,
  vacationCount: 0,
};

const updateCounts = (state: AbsenceState, days: number, absenceType: string, operation: 'add' | 'subtract') => {
  const adjustment = operation === 'add' ? days : -days;
  return {
    sickCount: absenceType === 'sick' ? state.sickCount + adjustment : state.sickCount,
    vacationCount: absenceType === 'vacation' ? state.vacationCount + adjustment : state.vacationCount,
  };
};

export const absenceReducer = createReducer(
  initialState,
  on(addAbsence, (state, {absence, daysRequested, absenceType}) => {
    const {sickCount, vacationCount} = updateCounts(state, daysRequested, absenceType, 'add');
    return {
      ...state,
      absence: [...state.absence, absence],
      sickCount,
      vacationCount,
    };
  }),
  on(deleteAbsence, (state, {id, daysRequested, absenceType}) => {
    const {sickCount, vacationCount} = updateCounts(state, daysRequested, absenceType, 'subtract');
    return {
      ...state,
      absence: state.absence.filter(absence => absence.id !== id),
      sickCount,
      vacationCount,
    };
  }),
  on(updateAbsence, (state, {id, changes, daysBefore, daysAfter, from, to}) => {
    let newSickCount = state.sickCount;
    let newVacationCount = state.vacationCount;

    if (from !== to) {
      const sickAdjustment = from === 'sick' ? -daysBefore : daysAfter;
      const vacationAdjustment = from === 'vacation' ? -daysBefore : daysAfter;

      newSickCount += sickAdjustment;
      newVacationCount += vacationAdjustment;
    } else if (from === 'vacation' && to === 'vacation') {
      newVacationCount += -daysBefore + daysAfter;
    } else if (from === 'sick' && to === 'sick') {
      newSickCount += -daysBefore + daysAfter;
    }
    return {
      ...state,
      absence: state.absence.map(item =>
        item.id === id ? {...item, ...changes} : item
      ),
      sickCount: newSickCount,
      vacationCount: newVacationCount,
    };
  })
);
