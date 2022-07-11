import {
  MatSnackBarRef,
  MAT_SNACK_BAR_DATA
} from '@angular/material/snack-bar';
import { Component, Inject } from '@angular/core';
import { SnackType } from '@utilities/enums/snack-type';
import { SnackBarModel } from '@utilities/models/snack-bar.model';

@Component({
  selector: 'sofka-snack-bar',
  templateUrl: './snack-bar.component.html',
  styleUrls: ['./snack-bar.component.scss']
})
export class SnackBarComponent {
  constructor(
    private snackRef: MatSnackBarRef<SnackBarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: SnackBarModel
  ) {}

  choiseCSS(): string {
    const css = 'snack-';
    switch (this.data.snackType) {
      case SnackType.SUCCESS:
        return css + 'success';
      case SnackType.WARNING:
        return css + 'warning';
      case SnackType.INFO:
        return css + 'info';
      case SnackType.ERROR:
        return css + 'error';
    }
  }

  dismiss(): void {
    if (this.data.click) this.data.click();
    else this.snackRef.dismiss();
  }
}
