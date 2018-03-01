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

export class Room {
  constructor(public resource_id: number,
              public room: string) {
  }
}

@Injectable()
export class BookingsService {
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

  public getParticipants(bookingId: number): Promise<Participants[]> {
    return new Promise((resolve, reject) => {
      const URL = 'http://localhost:3000/getparticipants?booking_id=' + bookingId;
      this.http.get(URL, { responseType: 'json' }).subscribe((response) => {
        resolve(response as Participants[]);
      });
    });
  }

  public deleteBooking(bookingId): void {
    const URL = 'http://localhost:3000/deletebooking?booking_id=' + bookingId + '&person_id=' + this.personId;
    this.http.delete(URL, { responseType: 'json' }).subscribe((response) => {
    });
  }

  public getRooms(): Promise<Room[]> {
    return new Promise((resolve, reject) => {
      const URL = 'http://localhost:3000/getrooms';
      this.http.get(URL, { responseType: 'json' }).subscribe((response) => {
        resolve(response as Room[]);
      });
    });
  }

  public getpeople(): Promise<Person[]> {
    return new Promise((resolve, reject) => {
      const URL = 'http://localhost:3000/getpeople';
      this.http.get(URL, { responseType: 'json' }).subscribe((response) => {
        resolve(response as Person[]);
      });
    });
  }

  public book(booking): void {
    const URL = 'http://localhost:3000/book';
    this.http.post(URL, JSON.stringify(booking), { responseType: 'text', headers: {'Content-Type' : 'application/json'} }).subscribe((response) => {
      console.log(response);
    });
  }
}
