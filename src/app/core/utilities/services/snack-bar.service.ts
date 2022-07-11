// Libraries
import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';

// Enums
import { SnackType } from '@utilities/enums/snack-type';

// Components
import { SnackBarComponent } from '@utilities/components/snack-bar/snack-bar.component';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {
  constructor(private snackbar: MatSnackBar) {}

  openSnackBar(
    message: string,
    action: string,
    snackType: SnackType,
    click?: object
  ): MatSnackBarRef<SnackBarComponent> {
    return this.snackbar.openFromComponent(SnackBarComponent, {
      data: { message, action, snackType, click }
    });
  }
}
