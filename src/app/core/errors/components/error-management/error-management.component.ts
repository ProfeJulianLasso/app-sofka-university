// Libraries
import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';

// Services
import { ErrorHandlerService } from '../../services/error-handler.service';

@Component({
  selector: 'sofka-error-management',
  templateUrl: './error-management.component.html',
  styleUrls: ['./error-management.component.scss']
})
export class ErrorManagementComponent implements OnInit, OnDestroy {
  private thereIsAnError!: Subscription;
  constructor(private errorHandler$: ErrorHandlerService) {}

  ngOnInit(): void {
    this.thereIsAnError = this.errorHandler$.thereIsAnErrorChange.subscribe({
      next: (data: boolean) => {
        console.log('thereIsAnErrorChange', data);
      }
    });
  }

  ngOnDestroy(): void {
    this.thereIsAnError.unsubscribe();
  }
}
