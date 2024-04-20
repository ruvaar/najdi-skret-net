import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'date'
})
export class DatePipe implements PipeTransform {

  transform(value: string): string {
    if (!value) {
      return 'Error fetching the date';
    }

    const date = new Date(value);
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1; 
    const year = date.getUTCFullYear();

    return `${day}.${month}.${year}`;
  }

}
