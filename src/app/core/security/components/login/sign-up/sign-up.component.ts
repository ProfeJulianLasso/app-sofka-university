// Libraries
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Component, OnDestroy } from '@angular/core';

// Environments
import { environment } from '@environment/environment';

// Validators
import { CheckMatchPasswordsValidator } from '../../../validators/sync/check-match-passwords.validator';

// Services
import { AuthService } from '../../../services/auth.service';
import { SignInSignUpService } from '../../../services/sign-in-sign-up.service';

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
export class SignUpComponent implements OnDestroy {
  frmSignUp: FormGroup;
  matcher: MyErrorStateMatcher;

  constructor(
    private auth$: AuthService,
    private signInSignUp$: SignInSignUpService
  ) {
    this.matcher = new MyErrorStateMatcher();
    this.frmSignUp = new FormGroup(
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

  ngOnDestroy(): void {
    this.changeToSignIn();
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
  }

  googleAuth(): void {
    this.auth$.GoogleAuth();
  }

  submitSignUp(): void {
    this.auth$.GoogleCreateUser(
      this.frmSignUp.get('email')?.value,
      this.frmSignUp.get('password')?.value
    );
    console.log(this.frmSignUp.getRawValue());
  }
}
