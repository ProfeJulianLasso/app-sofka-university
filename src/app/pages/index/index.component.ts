import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

// Components
import { LoginComponent } from '@security/components/login/login.component';

@Component({
  selector: 'sofka-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, OnDestroy {
  private modal!: MatDialogRef<LoginComponent>;

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.openDialog('500ms', '200ms');
  }

  ngOnDestroy(): void {
    this.modal.close();
  }

  openDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): void {
    this.modal = this.dialog.open(LoginComponent, {
      minWidth: '300px',
      maxWidth: '450px',
      enterAnimationDuration,
      exitAnimationDuration,
      autoFocus: false,
      disableClose: true
    });
  }
}
