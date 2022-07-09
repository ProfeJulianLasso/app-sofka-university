import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formOneError'
})
export class FormOneErrorPipe implements PipeTransform {
  transform(object: unknown): unknown {
    if (typeof object === 'object' && object !== null) {
      const keys = Object.keys(object);
      if (keys && keys.length > 0) {
        return keys[0];
      }
    }
    return null;
  }
}
