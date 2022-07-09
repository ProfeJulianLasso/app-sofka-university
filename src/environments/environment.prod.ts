export const environment = {
  production: true,
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
