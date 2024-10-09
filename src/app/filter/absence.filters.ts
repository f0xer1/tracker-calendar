import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";
import moment from "moment/moment";

export const dateValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const dateFrom = control.get('dateFrom');
  const dateTo = control.get('dateTo');

  if (dateFrom && dateTo && moment(dateFrom.value).isAfter(moment(dateTo.value))) {
    return {dateError: 'Start is greater than end'};
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

export const sickAndVacationCountValidator = (sickAndVacationCount: {
  sickCount: number,
  vacationCount: number
}, daysRequestedBefore: number) => {
  return (control: AbstractControl): ValidationErrors | null => {
    const absenceType = control.get('absenceType');
    const dateFrom = control.get('dateFrom');
    const dateTo = control.get('dateTo');

    if (absenceType && dateFrom && dateTo) {
      const type = absenceType.value;
      const startDate = moment(dateFrom.value);
      const endDate = moment(dateTo.value);
      const daysRequested = endDate.diff(startDate, 'days') + 1;

      if (type === 'sick' && (sickAndVacationCount.sickCount + daysRequested - daysRequestedBefore > 10)) {
        return {sickAndVacationCountError: 'You have taken the maximum number of sick days (10).'};
      }
      if (type === 'vacation' && (sickAndVacationCount.vacationCount + daysRequested - daysRequestedBefore > 10)) {
        return {sickAndVacationCountError: 'You have taken the maximum number of vacation days (10).'};
      }
    }

    return null;
  }
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
