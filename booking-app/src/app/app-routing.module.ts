import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {BookingPageComponent} from './booking-page/booking-page.component';
import {LoginComponent} from './login/login.component';

const routes: Routes = [
  { path: 'booking', component: BookingPageComponent },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes) ]
})
export class AppRoutingModule {}
