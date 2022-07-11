// Libraries
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';

//Services
import { AuthService } from '../../services/auth.service';
import { SignInSignUpService } from '../../services/sign-in-sign-up.service';

@Component({
  selector: 'sofka-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  signIn: boolean;
  progressBarLoading: boolean;
  signInSuscribe!: Subscription;
  isAuthSuscribe!: Subscription;

  constructor(
    private router: Router,
    private authService$: AuthService,
    private signInSignUp$: SignInSignUpService
  ) {
    this.progressBarLoading = false;
    this.signIn = signInSignUp$.SignIn;
  }

  ngOnInit(): void {
    this.createSignInSubscription();
    this.createIsAuthSubscription();
  }

  ngOnDestroy(): void {
    this.signInSuscribe.unsubscribe();
    this.isAuthSuscribe.unsubscribe();
  }

  changeProgressBar(data: boolean): void {
    this.progressBarLoading = data;
  }

  private createSignInSubscription(): void {
    this.signInSuscribe = this.signInSignUp$.signInChange.subscribe({
      next: (data: boolean) => (this.signIn = data),
      error: (err: unknown) => console.log(err),
      complete: () => console.log('complete')
    });
  }

  private createIsAuthSubscription(): void {
    this.isAuthSuscribe = this.authService$.isAuthChange.subscribe({
      next: (data: boolean) =>
        data
          ? this.router.navigateByUrl('/dashboard')
          : this.router.navigateByUrl(''),
      error: (err: unknown) => console.log(err)
    });
  }
}
