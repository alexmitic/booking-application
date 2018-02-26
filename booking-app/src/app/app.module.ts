import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {HttpClientModule, HttpClient} from '@angular/common/http';

import { AppComponent } from './app.component';
import {BookingPageComponent} from './booking-page/booking-page.component';
import { LoginComponent } from './login/login.component';
import { AppRoutingModule } from './/app-routing.module';
import {BookingsService} from './bookings.service';

@NgModule({
  declarations: [
    AppComponent,
    BookingPageComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    HttpClientModule,
    AppRoutingModule,
  ],
  providers: [BookingsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
