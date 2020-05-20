import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'isoDate',
})
export class IsoDatePipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    const date = moment(value);
    return args[0] === 'datetime' ? date.format('DD/MM/YYYY H:mm') : date.format('DD/MM/YYYY');
  }
}
