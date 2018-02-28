import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

export class Booking {
  constructor(booking_id: number,
              date: string,
              from: string,
              to: string,
              room: string) {
  }
}

export class Participants {
  constructor(full_name: string) {
  }
}

export class Person {
  constructor(public person_id: number,
              public full_name: string) {
  }
}

@Injectable()
export class BookingsService {

  public bookings: Booking[];
  public personId: number;

  constructor(private http: HttpClient) { }

  public reqMeetings(): Promise<Booking[]> {
    return new Promise((resolve, reject) => {
      const URL = 'http://localhost:3000/getbookings?person_id=' + this.personId;
      this.http.get(URL, { responseType: 'json' }).subscribe((response) => {
        resolve(response as Booking[]);
      });
    });
  }
}
