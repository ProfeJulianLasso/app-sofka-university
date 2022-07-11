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
/**
 * Servicio de autenticación del sistema
 *
 * @author Julian Lasso <julian.lasso@sofka.com.co>
 * @version 1.0.0
 */
export class AuthService {
  /**
   * Token del usuario que se identifica frente al sistema
   */
  private token: string;

  /**
   * Estado de la sesión del usuario frente al sistema, está identifica si o no
   */
  private isAuth: boolean;

  /**
   * Estado del correo sí se encuentra verificado por medio de firebase
   */
  private isEmailVerified: boolean;

  /**
   * Estado del envío del correo para su verificación. Esto se maneja frente a
   * usuarios que decidieron entrar con su correo y contraseña y no usaron
   * el proveedor de Google
   */
  private sendingEmailVerification: boolean;

  /**
   * Evento que emite TRUE o FALSE según el valor dado a isAuth para determinar
   * sí el usuario se ha identificado frente al sistema o no
   *
   * @return boolean
   */
  isAuthChange: EventEmitter<boolean>;

  /**
   * Evento que emite TRUE o FALSE según el valor dado a isEmailVerified para
   * determinar sí el correo del usuario ha sido verifcado o no
   *
   * @return boolean
   */
  isEmailVerifiedChange: EventEmitter<boolean>;

  /**
   * Evento que emite TRUE o FALSE segú el valor dado a sendingEmailVerification
   * para determinar sí el correo de verificación fue enviado o no al usuario
   * después de haber creado la cuenta
   *
   * @return boolean
   */
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

  /**
   * Obtiene el valor de isAuth, este valor determina sí el usuario está o no
   * autenticado en el sistema
   *
   * @return boolean
   */
  get IsAuth(): boolean {
    return this.isAuth;
  }

  /**
   * Obtiene el valor de sendingEmailVerification, este valor determin sí
   * el correo de verificación fue enviado o no
   *
   * @return boolean
   */
  get SendingEmailVerification(): boolean {
    return this.sendingEmailVerification;
  }

  /**
   * Obtiene el valor de isEmailVerified, este valor determina sí el correo de
   * verificación fue enviado o no cuando la cuenta se crea por priemra vez
   *
   * @return boolean
   */
  get IsEmailVerified(): boolean {
    return this.isEmailVerified;
  }

  /**
   * Obtiene el valor del token del usuario que se encuentra activo en la sesión
   *
   * @return string
   */
  get Token(): string {
    if (this.token === '') this.searchToken();
    return localStorage.getItem(environment.token) ?? this.token;
  }

  /**
   * Enlaza una cuenta de Google con el sistema para su autenticación, sí
   * el usuario ya existe en el sistema, entonces el usuario es autenticado
   *
   * @param className {string} Nombre del Componente (clase) que invoca el método
   *                  para asociar cualquier error que se produzca en la ejecución
   *                  del método
   */
  googleAuth(className: string): void {
    this.authLogin(className, new GoogleAuthProvider());
  }

  /**
   * Crea un usuario bajo nombre de usuario y contraseña, usando firebase
   * como base de datos del sistema en general
   *
   * @param username  {string} Correo del usuario
   * @param password  {string} Contraseña del susuario
   * @param className {string} Nombre del Componente (clase) que invoca el método
   *                  para asociar cualquier error que se produzca en la ejecución
   *                  del método
   */
  googleCreateUser(
    username: string,
    password: string,
    className: string
  ): void {
    this.createUser(
      username,
      sha512.create().update(password).hex(),
      className
    );
  }

  /**
   * Autenticación del sistema bajo usuario y contraseña en apoyo de firebase
   *
   * @param username  {string} Correo del usuario
   * @param password  {string} Contraseña del susuario
   */
  logIn(username: string, password: string): void {
    this.afAuth
      .signInWithEmailAndPassword(
        username,
        sha512.create().update(password).hex()
      )
      .then((result) => {
        if (!environment.production)
          console.log('emailVerified: ', result.user?.emailVerified);
        if (!result.user?.emailVerified) this.unverifiedEmail();
        this.internalLoginProcess();
      })
      .catch((error) => {
        this.errorHandler$.ReportError(
          'SignInComponent',
          error.message,
          error.code
        );
      });
  }

  /**
   * Cierra la sesión activa en el sistema
   */
  logOut(): void {
    this.afAuth.signOut().then(() => {
      this.changeIsAuth(false);
      localStorage.removeItem(environment.token);
      this.router.navigateByUrl('');
    });
  }

  /**
   * Corre elctrónico no verificado, método usado para cuando se ha detectado
   * que el correo electrónico del usuario no ha sido verificado
   */
  private unverifiedEmail(): void {
    this.changeIsEmailVerified(false);
    this.logOut();
  }

  /**
   * Proceso interno de identificación, usado cuando el usuario ya está habilitado
   * y listo para decirle al sistema que debe avalarse la sesión del usuario
   * en cuestión
   */
  private internalLoginProcess(): void {
    this.changeIsEmailVerified(true);
    this.getTokenFromCurrentUser();
    this.router.navigateByUrl('/seguro');
  }

  /**
   * Busca el token del usuario que ya se encuentra verificado en el sistema
   */
  private searchToken(): void {
    this.afAuth.idToken.forEach((token) => {
      if (typeof token === 'string') {
        localStorage.setItem(environment.token, token);
        this.token = token;
      }
    });
  }

  /**
   * Obtiene el token que se encuentra en proceso de inicio de sesión
   */
  private getTokenFromCurrentUser() {
    this.afAuth.currentUser.then((user) => {
      user?.getIdToken().then((token) => {
        if (!environment.production) console.log('Token del usuario: ', token);
        this.token = token;
        localStorage.setItem(environment.token, token);
      });
    });
  }

  /**
   * Cambia el estado de isAuth, usado para identificar sí el usuario se encuentra
   * identificado o no el en sistema
   *
   * @param isAuth {boolean} Estado a cambiar
   */
  private changeIsAuth(isAuth: boolean): void {
    this.isAuth = isAuth;
    this.isAuthChange.emit(isAuth);
  }

  /**
   * Cambia el estado de isEmailVerified, usado para identificar sí el correo
   * del usuario ha sido verificado o no
   *
   * @param isEmailVerified {boolean} Estado a cambiar
   */
  private changeIsEmailVerified(isEmailVerified: boolean): void {
    this.isEmailVerified = isEmailVerified;
    this.isEmailVerifiedChange.emit(isEmailVerified);
  }

  /**
   * Cambia el estado de sendingEmailVerification, usado para identificar sí
   * el correo de verificación fue enviado o no cuando el usuario es creado
   * por primera vez en el sistema
   *
   * @param sendingEmailVerification {boolean} Estado a cambiar
   */
  private changeSendingEmailVerification(
    sendingEmailVerification: boolean
  ): void {
    this.sendingEmailVerification = sendingEmailVerification;
    this.sendingEmailVerificationChange.emit(sendingEmailVerification);
  }

  /**
   * Método para la identificación del usuario usando una cuenta de Google y
   * proveedor de autenticación del mismo Google
   *
   * @param className {string} Nombre del Componente (clase) que invoca el método
   *                  para asociar cualquier error que se produzca en la ejecución
   *                  del método
   * @param provider  {AuthProvider} Interface that represents an auth provider,
   *                  used to facilitate creating AuthCredential
   */
  private authLogin(className: string, provider: AuthProvider): void {
    this.afAuth
      .signInWithPopup(provider)
      .then((result) => {
        if (!environment.production)
          console.log('Ha iniciado sesión con éxito!');
        this.getTokenFormAuthLoginAndChangeIsAuth(result);
        this.changeIsAuth(true);
      })
      .catch((error) => {
        this.errorHandler$.ReportError(className, error.message, error.code);
      });
  }

  /**
   * Obtiene el token de un usuario identificado frente al sistema por medio
   * del autenticador de Google
   *
   * @param data {firebase.auth.UserCredential} A structure containing a User,
   *             an AuthCredential, the operationType, and any additional user
   *             information that was returned from the identity provider.
   *             operationType could be 'signIn' for a sign-in operation,
   *             'link' for a linking operation and 'reauthenticate' for
   *             a reauthentication operation.
   */
  private getTokenFormAuthLoginAndChangeIsAuth(
    data: firebase.auth.UserCredential
  ): void {
    data.user?.getIdToken().then((token) => {
      localStorage.setItem(environment.token, token);
      this.token = token;
    });
  }

  private createUser(username: string, password: string, className: string) {
    this.afAuth
      .createUserWithEmailAndPassword(username, password)
      .then((result) => {
        if (!environment.production) console.log(result);
        this.sendEmailVerification(className, this.afAuth);
      })
      .catch((error) => {
        this.errorHandler$.ReportError(className, error.message, error.code);
      });
  }

  private sendEmailVerification(
    className: string,
    afAuth: AngularFireAuth
  ): void {
    afAuth.currentUser
      .then((user) => {
        this.sendEmailVerificationForUser(className, user);
      })
      .catch((error) => {
        this.errorHandler$.ReportError(className, error.message, error.code);
      });
  }

  private sendEmailVerificationForUser(
    className: string,
    user: firebase.User | null
  ): void {
    user
      ?.sendEmailVerification()
      ?.then(() => {
        if (!environment.production)
          console.log('Correo de confirmación enviado');
        this.changeSendingEmailVerification(true);
        this.logOut();
      })
      ?.catch((error) => {
        this.errorHandler$.ReportError(className, error.message, error.code);
      });
  }
}
