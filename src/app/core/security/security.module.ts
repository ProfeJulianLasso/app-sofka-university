// Libraries
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroupDirective,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

// Environments
import { environment } from '@environment/environment';

// RouterModule
import { SecurityRoutingModule } from './security-routing.module';

// modules
import { ErrorsModule } from '@errors/errors.module';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { UtilitiesModule } from '@utilities/utilities.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
// import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';

// Components
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { SignInComponent } from './components/login/sign-in/sign-in.component';
import { SignUpComponent } from './components/login/sign-up/sign-up.component';

@NgModule({
  declarations: [
    LoginComponent,
    LogoutComponent,
    SignInComponent,
    SignUpComponent
  ],
  providers: [FormGroupDirective],
  imports: [
    CommonModule,
    FormsModule,
    ErrorsModule,
    MatIconModule,
    MatInputModule,
    UtilitiesModule,
    MatButtonModule,
    MatDialogModule,
    MatCheckboxModule,
    // MatSnackBarModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    SecurityRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule
  ],
  exports: [LoginComponent]
})
export class SecurityModule {}
