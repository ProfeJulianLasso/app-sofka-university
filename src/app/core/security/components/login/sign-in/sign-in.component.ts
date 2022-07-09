// Libraries
import {
  MatSnackBar,
  MatSnackBarRef,
  TextOnlySnackBar
} from '@angular/material/snack-bar';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

// Environments
import { environment } from '@environment/environment';

// Models
import { ErrorHandler } from '@errors/models/error-handler.model';

// Services
import { AuthService } from '../../../services/auth.service';
import { SignInSignUpService } from '../../../services/sign-in-sign-up.service';

@Component({
  selector: 'sofka-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit, OnDestroy {
  frmSignIn: FormGroup;
  error!: ErrorHandler;
  private snackBarRef!: MatSnackBarRef<TextOnlySnackBar>;

  constructor(
    private auth$: AuthService,
    private snackBar: MatSnackBar,
    private signInSignUp$: SignInSignUpService
  ) {
    this.frmSignIn = new FormGroup({
      username: new FormControl(null, [
        Validators.required,
        Validators.pattern(environment.emailPattern)
      ]),
      password: new FormControl(null, [Validators.required]),
      rememberMe: new FormControl(false)
    });
  }

  ngOnInit(): void {
    this.openSnackBar('Hola Mundo', 'Aceptar');
  }

  ngOnDestroy(): void {
    this.snackBarRef.dismiss();
  }

  changeToSignUp(): void {
    this.signInSignUp$.changeSignIn(false);
  }

  openSnackBar(message: string, action: string) {
    this.snackBarRef = this.snackBar.open(message, action);
  }

  submitSignIn(): void {
    console.log(this.frmSignIn.getRawValue());
  }

  googleAuth(): void {
    this.frmSignIn.disable();
    this.auth$.GoogleAuth();
  }
}
