// Libraries
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators
} from '@angular/forms';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';

// Environments
import { environment } from '@environment/environment';

// Models
import { ErrorHandler } from '@errors/models/error-handler.model';

// Validators
import { CheckMatchPasswordsValidator } from '../../../validators/sync/check-match-passwords.validator';

// Enums
import { SnackType } from '@utilities/enums/snack-type';

// Services
import { AuthService } from '@security/services/auth.service';
import { SnackBarService } from '@utilities/services/snack-bar.service';
import { ErrorHandlerService } from '@errors/services/error-handler.service';
import { SignInSignUpService } from '@security/services/sign-in-sign-up.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    _form: FormGroupDirective | NgForm | null
  ): boolean {
    return control?.parent?.get('password')?.value !== control?.value;
  }
}

@Component({
  selector: 'sofka-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit, OnDestroy {
  btnCancel: boolean;
  frmSignUp: FormGroup;
  btnGoogleAuth: boolean;
  matcher: MyErrorStateMatcher;
  private thereIsAnError!: Subscription;
  @Output() loading: EventEmitter<boolean>;

  constructor(
    private router: Router,
    private auth$: AuthService,
    private snackBar$: SnackBarService,
    private signInSignUp$: SignInSignUpService,
    private errorHandler$: ErrorHandlerService
  ) {
    this.btnCancel = false;
    this.btnGoogleAuth = false;
    this.frmSignUp = this.createForm();
    this.matcher = new MyErrorStateMatcher();
    this.loading = new EventEmitter<boolean>();
  }

  ngOnInit(): void {
    this.activeErrorTracking();
    this.activeChangeSendingEmailVerification();
  }

  ngOnDestroy(): void {
    this.changeToSignIn();
    this.thereIsAnError.unsubscribe();
  }

  get passwordMatchError(): boolean {
    return (
      this.frmSignUp.getError('match') &&
      this.frmSignUp.get('passwordConfirm')?.touched &&
      !this.frmSignUp.get('passwordConfirm')?.hasError('required')
    );
  }

  changeToSignIn(): void {
    this.signInSignUp$.changeSignIn(true);
    this.loading.emit(false);
  }

  googleAuth(): void {
    this.loading.emit(true);
    this.frmSignUp.disable();
    this.disableButtons();
    this.auth$.googleAuth(SignUpComponent.name);
  }

  submitSignUp(): void {
    this.loading.emit(true);
    this.frmSignUp.disable();
    this.disableButtons();
    this.auth$.googleCreateUser(
      this.frmSignUp.get('email')?.value,
      this.frmSignUp.get('password')?.value,
      SignUpComponent.name
    );
    if (!environment.production) console.log(this.frmSignUp.getRawValue());
  }

  private createForm(): FormGroup {
    return new FormGroup(
      {
        email: new FormControl(null, [
          Validators.required,
          Validators.pattern(environment.emailPattern)
        ]),
        password: new FormControl(null, [
          Validators.required,
          Validators.pattern(environment.passwordPattern)
        ]),
        passwordConfirm: new FormControl(null, [Validators.required])
      },
      [
        CheckMatchPasswordsValidator.MatchValidator(
          'password',
          'passwordConfirm'
        )
      ]
    );
  }

  private activeChangeSendingEmailVerification(): void {
    this.auth$.sendingEmailVerificationChange.subscribe({
      next: (sendingEmailVerification: boolean) => {
        if (sendingEmailVerification)
          console.log('Mostrar notificación de envío de correo');
        this.snackBar$.openSnackBar(
          'Su usuario fue creado exitosamente, por favor valide su correo por medio del enlace que se ha envido a su correo electrónico',
          'ACEPTAR',
          SnackType.SUCCESS,
          (): void => {
            window.location.reload();
          }
        );
      }
    });
  }

  private activeErrorTracking(): void {
    this.thereIsAnError = this.errorHandler$.thereIsAnErrorChange.subscribe({
      next: (data: boolean) => {
        if (data)
          this.evaluateError(
            this.errorHandler$.Errors.map((error) =>
              error.component === SignUpComponent.name ? error : null
            )
          );
      }
    });
  }

  private evaluateError(error: Array<ErrorHandler | null>): void {
    const code = error.map((error) => (error?.code ? error.code : ''));
    if (String(code) === 'auth/popup-closed-by-user') {
      this.errorHandler$.DeleteLastErrorHandler();
      this.frmSignUp.enable();
      this.loading.emit(false);
      this.enableButtons();
    }
  }

  private disableButtons(): void {
    this.btnCancel = true;
    this.btnGoogleAuth = true;
  }

  private enableButtons(): void {
    this.btnCancel = false;
    this.btnGoogleAuth = false;
  }
}
