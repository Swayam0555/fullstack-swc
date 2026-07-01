import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'keyFormat',
  standalone: true
})
export class KeyFormatPipe implements PipeTransform {
  transform(value: string | undefined): string {
    if (!value) return '';

    // Clean string: remove existing hyphens and convert to uppercase
    const cleanVal = value.replace(/-/g, '').toUpperCase();
    
    // Match groups of 4 characters using regex
    const matches = cleanVal.match(/.{1,4}/g);
    
    if (matches) {
      // Join the chunks back together with a hyphen
      return matches.join('-');
    }
    
    return cleanVal;
  }
}
