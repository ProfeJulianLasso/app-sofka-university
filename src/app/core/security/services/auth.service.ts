// Libraries
import { sha512 } from 'js-sha512';
import firebase from 'firebase/compat';
import { Router } from '@angular/router';
import { EventEmitter, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthProvider, GoogleAuthProvider } from 'firebase/auth';

// Services
import { ErrorHandlerService } from '@errors/services/error-handler.service';

// Environments
import { environment } from '@environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  private isAuth: boolean;
  private isEmailVerified: boolean;
  private sendingEmailVerification: boolean;
  isAuthChange: EventEmitter<boolean>;
  isEmailVerifiedChange: EventEmitter<boolean>;
  sendingEmailVerificationChange: EventEmitter<boolean>;

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private errorHandler$: ErrorHandlerService
  ) {
    this.token = '';
    this.isAuth = false;
    this.isEmailVerified = false;
    this.sendingEmailVerification = false;
    this.isAuthChange = new EventEmitter<boolean>();
    this.isEmailVerifiedChange = new EventEmitter<boolean>();
    this.sendingEmailVerificationChange = new EventEmitter<boolean>();
  }

  get IsAuth(): boolean {
    return this.isAuth;
  }

  get SendingEmailVerification(): boolean {
    return this.sendingEmailVerification;
  }

  get IsEmailVerified(): boolean {
    return this.isEmailVerified;
  }

  get Token(): string {
    if (this.token === '') this.searchToken();
    return localStorage.getItem(environment.token) ?? this.token;
  }

  GoogleAuth(): void {
    this.authLogin(new GoogleAuthProvider());
  }

  GoogleCreateUser(username: string, password: string): void {
    this.createUser(username, sha512.create().update(password).hex());
  }

  LogIn(username: string, password: string): void {
    this.afAuth
      .signInWithEmailAndPassword(
        username,
        sha512.create().update(password).hex()
      )
      .then((result) => {
        if (!environment.production)
          console.log('emailVerified: ', result.user?.emailVerified);
        if (!result.user?.emailVerified) {
          this.unverifiedEmail();
        }
        this.internalLoginProcess();
      })
      .catch((error) => {
        this.errorHandler$.ReportError('sign-in', error.message, error);
      });
  }

  LogOut(): void {
    this.afAuth.signOut().then(() => {
      this.changeIsAuth(false);
      this.router.navigateByUrl('');
    });
  }

  private unverifiedEmail(): void {
    this.changeIsEmailVerified(false);
    this.LogOut();
  }

  private internalLoginProcess(): void {
    this.changeIsEmailVerified(true);
    this.getTokenFromCurrentUser(this.afAuth);
    this.router.navigateByUrl('/seguro');
  }

  private searchToken(): void {
    this.afAuth.idToken.forEach((token) => {
      if (typeof token === 'string') {
        localStorage.setItem(environment.token, token);
        this.token = token;
      }
    });
  }

  private getTokenFromCurrentUser(afAuth: AngularFireAuth) {
    afAuth.currentUser.then((user) => {
      user?.getIdToken().then((token) => {
        if (!environment.production) console.log('TOKEN LOGIN: ', token);
        this.token = token;
        localStorage.setItem(environment.token, token);
      });
    });
  }

  private changeIsAuth(isAuth: boolean): void {
    this.isAuth = isAuth;
    this.isAuthChange.emit(isAuth);
  }

  private changeIsEmailVerified(isEmailVerified: boolean): void {
    this.isEmailVerified = isEmailVerified;
    this.isEmailVerifiedChange.emit(isEmailVerified);
  }

  private changeSendingEmailVerification(
    sendingEmailVerification: boolean
  ): void {
    this.sendingEmailVerification = sendingEmailVerification;
    this.sendingEmailVerificationChange.emit(sendingEmailVerification);
  }

  private authLogin(provider: AuthProvider): void {
    this.afAuth
      .signInWithPopup(provider)
      .then((result) => {
        if (!environment.production)
          console.log('Ha iniciado sesión con éxito!');
        this.getTokenFormAuthLoginAndChangeIsAuth(result);
      })
      .catch((error) => {
        this.errorHandler$.ReportError('sign-in', error.message, error);
      });
  }

  private getTokenFormAuthLoginAndChangeIsAuth(
    data: firebase.auth.UserCredential
  ): void {
    data.user?.getIdToken().then((token) => {
      localStorage.setItem(environment.token, token);
      this.token = token;
      this.changeIsAuth(true);
    });
  }

  private createUser(username: string, password: string) {
    this.afAuth
      .createUserWithEmailAndPassword(username, password)
      .then((result) => {
        if (!environment.production) console.log(result);
        this.sendEmailVerification(this.afAuth);
      })
      .catch((error) => {
        this.errorHandler$.ReportError('sign-up', error.message, error);
      });
  }

  private sendEmailVerification(afAuth: AngularFireAuth): void {
    afAuth.currentUser
      .then((user) => {
        this.sendEmailVerificationForUser(user);
      })
      .catch((error) => {
        this.errorHandler$.ReportError('sign-up', error.message, error);
      });
  }

  private sendEmailVerificationForUser(user: firebase.User | null): void {
    user
      ?.sendEmailVerification()
      ?.then(() => {
        if (!environment.production)
          console.log('Correo de confirmación enviado');
        this.changeSendingEmailVerification(true);
      })
      ?.catch((error) => {
        this.errorHandler$.ReportError('sign-up', error.message, error);
      });
  }
}
