// Libraries
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Pipes
import { FormOneErrorPipe } from './pipes/form-one-error.pipe';

@NgModule({
  declarations: [FormOneErrorPipe],
  imports: [CommonModule],
  exports: [FormOneErrorPipe]
})
export class UtilitiesModule {}
