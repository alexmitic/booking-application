import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private http: HttpClient) { }

  public ngOnInit() {
  }

  public login(): void {
    // Get user information
    const email = (<HTMLInputElement>document.getElementById('email')).value;
    const password = (<HTMLInputElement>document.getElementById('password')).value;

    // TODO Send username and password as query string
    const URL = 'http://localhost:3000/?email=' + email + '&password=' + password;
    this.http.get(URL, { responseType: 'text' }).subscribe((response) => {
      // Reroute to booking component
    });
  }

}
