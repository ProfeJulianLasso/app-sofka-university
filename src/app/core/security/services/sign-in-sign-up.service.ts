import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SignInSignUpService {
  private signIn: boolean;
  signInChange: EventEmitter<boolean>;

  constructor() {
    this.signIn = true;
    this.signInChange = new EventEmitter<boolean>();
  }

  get SignIn(): boolean {
    return this.signIn;
  }

  changeSignIn(signIn: boolean) {
    this.signIn = signIn;
    this.signInChange.emit(signIn);
  }
}
