// Libraries
import { EventEmitter, Injectable } from '@angular/core';
import { environment } from '@environment/environment';

// Models
import { ErrorHandler } from '../models/error-handler.model';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  private thereIsAnError: boolean;
  private errors: Array<ErrorHandler>;
  thereIsAnErrorChange: EventEmitter<boolean>;

  constructor() {
    this.thereIsAnError = false;
    this.thereIsAnErrorChange = new EventEmitter<boolean>();
    this.errors = new Array<ErrorHandler>();
  }

  get ThereIsAnError(): boolean {
    return this.thereIsAnError;
  }

  get Errors(): Array<ErrorHandler> {
    return this.errors;
  }

  set Error(error: ErrorHandler) {
    this.errors.push(error);
    this.ChangeThereIsAnError(true);
  }

  GetError(index: number): ErrorHandler {
    return this.errors[index];
  }

  DeleteErrorHandler(error: ErrorHandler): void {
    const key = this.errors.indexOf(error, 0);
    if (key > -1) this.errors.splice(key, 1);
    if (this.errors.length === 0) this.ChangeThereIsAnError(false);
  }

  DeleteLastErrorHandler(): void {
    this.errors.pop();
    if (this.errors.length === 0) this.ChangeThereIsAnError(false);
  }

  ReportError(component: string, message: string, error: object): void {
    if (!environment.production) console.error(error);
    this.Error = { component, message, error };
  }

  private ChangeThereIsAnError(thereIsAnError: boolean) {
    this.thereIsAnError = thereIsAnError;
    this.thereIsAnErrorChange.emit(thereIsAnError);
  }
}
