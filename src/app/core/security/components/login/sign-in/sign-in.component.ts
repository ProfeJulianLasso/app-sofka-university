// Libraries
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBarRef } from '@angular/material/snack-bar';

// Environments
import { environment } from '@environment/environment';

// Models
import { ErrorHandler } from '@errors/models/error-handler.model';

// Components
import { SnackBarComponent } from '@utilities/components/snack-bar/snack-bar.component';

// Services
import { AuthService } from '@security/services/auth.service';
import { SnackBarService } from '@utilities/services/snack-bar.service';
import { ErrorHandlerService } from '@errors/services/error-handler.service';
import { SignInSignUpService } from '@security/services/sign-in-sign-up.service';

@Component({
  selector: 'sofka-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit, OnDestroy {
  frmSignIn: FormGroup;
  private thereIsAnError!: Subscription;
  @Output() loading: EventEmitter<boolean>;
  private snackBarRef!: MatSnackBarRef<SnackBarComponent>;

  constructor(
    private auth$: AuthService,
    private snackBar$: SnackBarService,
    private signInSignUp$: SignInSignUpService,
    private errorHandler$: ErrorHandlerService
  ) {
    this.frmSignIn = new FormGroup({
      username: new FormControl(null, [
        Validators.required,
        Validators.pattern(environment.emailPattern)
      ]),
      password: new FormControl(null, [Validators.required]),
      rememberMe: new FormControl(false)
    });
    this.loading = new EventEmitter<boolean>();
  }

  ngOnInit(): void {
    this.activeErrorTracking();
  }

  ngOnDestroy(): void {
    if (this.snackBarRef) this.snackBarRef.dismiss();
    this.thereIsAnError.unsubscribe();
  }

  changeToSignUp(): void {
    this.signInSignUp$.changeSignIn(false);
  }

  submitSignIn(): void {
    console.log(this.frmSignIn.getRawValue());
  }

  googleAuth(): void {
    this.frmSignIn.disable();
    this.loading.emit(true);
    this.auth$.googleAuth(SignInComponent.name);
  }

  private activeErrorTracking(): void {
    this.thereIsAnError = this.errorHandler$.thereIsAnErrorChange.subscribe({
      next: (data: boolean) => {
        if (data)
          this.evaluateError(
            this.errorHandler$.Errors.map((error) =>
              error.component === SignInComponent.name ? error : null
            )
          );
      }
    });
  }

  private evaluateError(error: Array<ErrorHandler | null>): void {
    const code = error.map((error) => (error?.code ? error.code : ''));
    if (String(code) === 'auth/popup-closed-by-user') {
      this.errorHandler$.DeleteLastErrorHandler();
      this.frmSignIn.enable();
      this.loading.emit(false);
    }
  }
}
