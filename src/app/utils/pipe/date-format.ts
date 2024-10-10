import {Pipe, PipeTransform} from '@angular/core';
import moment from "moment";
import {map, Observable} from "rxjs";

@Pipe({
  name: 'dateFormat',
  standalone: true
})
export class DateFormatPipe implements PipeTransform {
  transform(date: Observable<moment.Moment | null>, format = 'YYYY'):Observable<string> {
    return date.pipe(map((d) => moment(d)!.format(format)));
  }
}
