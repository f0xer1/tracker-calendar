import { Pipe, PipeTransform } from '@angular/core';
import moment from "moment";

@Pipe({
  name: 'yearRange',
  standalone: true
})
export class YearRangePipe implements PipeTransform {
  transform(date: moment.Moment): { min: string; max: string } {
    const startOfYear = date.clone().startOf('year').toISOString();
    const endOfYear = date.clone().endOf('year').toISOString();

    return { min: startOfYear, max: endOfYear };
  }
}
