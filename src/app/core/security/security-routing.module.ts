// Libraries
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//Components
import { LogoutComponent } from './components/logout/logout.component';

const routes: Routes = [
  {
    path: 'logout',
    component: LogoutComponent,
    canActivate: []
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecurityRoutingModule {}
