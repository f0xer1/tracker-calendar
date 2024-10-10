import {createAction, props} from "@ngrx/store";

import {Absence} from "../models/absence.model";

export const addAbsence = createAction(
  '[Absence] Add Absence',
  props<{ year: number, absence: Absence; daysRequested: number; absenceType: string }>()
);

export const updateAbsence = createAction(
  '[Absence] Update Absence Item',
  props<{
    year: number, id: number; changes: Partial<Absence>, daysBefore: number, daysAfter: number, from: string,
    to: string
  }>()
);
export const deleteAbsence = createAction(
  '[Absence] Delete Absence Item',
  props<{ year: number, id: number; daysRequested: number; absenceType: string }>()
);
