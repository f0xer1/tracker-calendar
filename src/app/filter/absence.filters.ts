import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";
import moment from "moment/moment";

export const dateValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const dateFrom = control.get('dateFrom');
  const dateTo = control.get('dateTo');
  if (dateFrom && dateTo && dateFrom.value && dateTo.value) {
    if (moment(dateFrom.value).isAfter(moment(dateTo.value))) {
      return {dateError: 'Start is greater than end'};
    } else if (moment(dateFrom.value).year() !== (moment(dateTo.value).year())) {
      return {dateError: 'Absence are allocated only for 1 year'};
    }
  }

  return null;
};
export const busyDateValidator = (busyDates: { start: moment.Moment, end: moment.Moment }[]): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const dateFrom = control.get('dateFrom');
    const dateTo = control.get('dateTo');

    if (dateFrom && dateTo) {
      const start = moment(dateFrom.value);
      const end = moment(dateTo.value);

      if (areDatesOverlapping(start, end, busyDates)) {
        return {busyDateError: 'Selected dates overlap with existing busy dates'};
      }
    }

    return null;
  };
};

export const sickAndVacationCountValidator = (
  sickAndVacationCount: { sickCount: number; vacationCount: number },
  daysRequestedBefore: number,
  typeBefore: string
) => {
  return (control: AbstractControl): ValidationErrors | null => {
    const absenceType = control.get('absenceType')?.value;
    const dateFrom = moment(control.get('dateFrom')?.value);
    const dateTo = moment(control.get('dateTo')?.value);

    if (absenceType && dateFrom.isValid() && dateTo.isValid()) {
      const daysRequested = dateTo.diff(dateFrom, 'days') + 1;
      const isTypeChanged = absenceType !== typeBefore;
      const totalSickDays = sickAndVacationCount.sickCount + (absenceType === 'sick' ? daysRequested : 0) - (typeBefore === 'sick' && !isTypeChanged ? daysRequestedBefore : 0);
      const totalVacationDays = sickAndVacationCount.vacationCount + (absenceType === 'vacation' ? daysRequested : 0) - (typeBefore === 'vacation' && !isTypeChanged ? daysRequestedBefore : 0);

      if (absenceType === 'sick' && totalSickDays > 10) {
        return {sickAndVacationCountError: 'You have taken the maximum number of sick days (10).'};
      }

      if (absenceType === 'vacation' && totalVacationDays > 10) {
        return {sickAndVacationCountError: 'You have taken the maximum number of vacation days (10).'};
      }
    }

    return null;
  };
};

const areDatesOverlapping = (start: moment.Moment, end: moment.Moment, busyDates: {
  start: moment.Moment,
  end: moment.Moment
}[]) => {
  return busyDates.some(busyDate =>
    start.isBetween(busyDate.start, busyDate.end, null, '[]') ||
    end.isBetween(busyDate.start, busyDate.end, null, '[]') ||
    busyDate.start.isBetween(start, end, null, '[]') ||
    busyDate.end.isBetween(start, end, null, '[]')
  );
};
