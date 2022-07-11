// Libraries
import { Component, OnInit } from '@angular/core';

// Services
import { AuthService } from '@security/services/auth.service';

@Component({
  selector: 'sofka-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  constructor(private auth$: AuthService) {}

  ngOnInit() {
    const data = this.auth$.Token;
    console.log('data', data);
  }

  logout(): void {
    this.auth$.logOut();
  }
}
