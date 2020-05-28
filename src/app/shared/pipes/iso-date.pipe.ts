import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'isoDate',
})
export class IsoDatePipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    if (!value) {
      return;
    }
    const date = moment((value as firebase.firestore.Timestamp).toDate());
    return args[0] === 'datetime' ? date.format('DD/MM/YYYY H:mm') : date.format('DD/MM/YYYY');
  }
}
