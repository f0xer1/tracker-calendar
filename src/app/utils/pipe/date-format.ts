import { Pipe, PipeTransform } from '@angular/core';
import moment from "moment";

@Pipe({
  name: 'dateFormat',
  standalone: true,

})
export class DateFormatPipe implements PipeTransform {
  transform(date: moment.Moment | null, format = 'YYYY'): string {
    return moment(date)!.format(format);
  }
}
