// Libraries
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Modules
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';

// Pipes
import { FormOneErrorPipe } from './pipes/form-one-error.pipe';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { SnackBarComponent } from './components/snack-bar/snack-bar.component';

@NgModule({
  declarations: [FormOneErrorPipe, ProgressBarComponent, SnackBarComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    FlexLayoutModule,
    MatSnackBarModule
  ],
  exports: [FormOneErrorPipe, ProgressBarComponent]
})
export class UtilitiesModule {}
