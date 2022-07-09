// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  emailPattern:
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,
  passwordPattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/g,
  token: 'token',
  firebaseConfig: {
    apiKey: 'AIzaSyCFmpbLDAmeiS-rTXi-98poEfPZOk1S9wg',
    authDomain: 'sofka-university.firebaseapp.com',
    projectId: 'sofka-university',
    storageBucket: 'sofka-university.appspot.com',
    messagingSenderId: '594706918893',
    appId: '1:594706918893:web:f24f87b4f780f5f1798be4',
    measurementId: 'G-SPC0DN48KE'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
