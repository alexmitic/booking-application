import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {BookingsService, Person} from '../bookings.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private http: HttpClient,
              private router: Router,
              private bookingsService: BookingsService) { }

  public ngOnInit() {
  }

  public login(): void {
    // Get user information
    const email = (<HTMLInputElement> document.getElementById('email')).value;
    const password = (<HTMLInputElement> document.getElementById('password')).value;

    // TODO Send username and password as query string
    const URL = 'http://localhost:3000/login?email=' + email + '&password=' + password;
    this.http.get(URL, { responseType: 'json' }).subscribe((response) => {
      if (response !== 'FAIL') {
        this.bookingsService.personId = (response as Person).person_id;
        this.router.navigateByUrl('/booking');
      }
    });
  }
}
