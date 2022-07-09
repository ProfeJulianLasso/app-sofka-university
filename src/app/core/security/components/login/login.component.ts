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
  signInSuscribe!: Subscription;

  constructor(
    private router: Router,
    private authService$: AuthService,
    private signInSignUp$: SignInSignUpService
  ) {
    this.signIn = signInSignUp$.SignIn;
  }

  ngOnInit(): void {
    this.signInSuscribe = this.signInSignUp$.signInChange.subscribe({
      next: (data: boolean) => (this.signIn = data),
      error: (err: any) => console.log(err),
      complete: () => console.log('complete')
    });
    this.authService$.isAuthChange.subscribe({
      next: (data: boolean) =>
        data
          ? this.router.navigateByUrl('/dashboard')
          : this.router.navigateByUrl(''),
      error: (err: any) => console.log(err)
    });
  }

  ngOnDestroy(): void {
    this.signInSuscribe.unsubscribe();
  }
}
