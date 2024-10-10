import {createReducer, on} from "@ngrx/store";

import {addAbsence, deleteAbsence, updateAbsence} from "./absence.action";
import {AbsenceState} from "./absence.state";

export const initialState: AbsenceState[] = [];

const findOrCreateYearState = (state: AbsenceState[], year: number): AbsenceState => {
  const yearState = state.find(absence => absence.year === year);
  return yearState
    ? yearState
    : {year, absence: [], sickCount: 0, vacationCount: 0};
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
  on(addAbsence, (state, {year, absence, daysRequested, absenceType}) => {
    const yearState = findOrCreateYearState(state, year);
    const {sickCount, vacationCount} = updateCounts(yearState, daysRequested, absenceType, 'add');
    return [
      ...state.filter(abs => abs.year !== year),
      {
        ...yearState,
        absence: [...yearState.absence, absence],
        sickCount,
        vacationCount,
      }
    ];
  }),
  on(deleteAbsence, (state, {year, id, daysRequested, absenceType}) => {
    const yearState = findOrCreateYearState(state, year);
    const {sickCount, vacationCount} = updateCounts(yearState, daysRequested, absenceType, 'subtract');
    return [
      ...state.filter(abs => abs.year !== year),
      {
        ...yearState,
        absence: yearState.absence.filter(abs => abs.id !== id),
        sickCount,
        vacationCount,
      }
    ];
  }),
  on(updateAbsence, (state, {year, id, changes, daysBefore, daysAfter, from, to}) => {
    const yearState = findOrCreateYearState(state, year);
    let newSickCount = yearState.sickCount;
    let newVacationCount = yearState.vacationCount;

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
    return [
      ...state.filter(abs => abs.year !== year),
      {
        ...yearState,
        absence: yearState.absence.map(item =>
          item.id === id ? {...item, ...changes} : item
        ),
        sickCount: newSickCount,
        vacationCount: newVacationCount,
      }
    ];
  })
);
