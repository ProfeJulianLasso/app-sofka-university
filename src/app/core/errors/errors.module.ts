// Libraries
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Components
import { ErrorManagementComponent } from './components/error-management/error-management.component';

@NgModule({
  declarations: [ErrorManagementComponent],
  imports: [CommonModule],
  exports: [ErrorManagementComponent]
})
export class ErrorsModule {}
