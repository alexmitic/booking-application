import { Injectable } from '@angular/core';

export class Meeting {
  constructor(date: string,
              from: string,
              to: string,
              room: string) {
  }
}

@Injectable()
export class BookingsService {

  public meetings: Meeting[] = [{date: '2017-01-01', from: '11:00', to: '12:00', room: '345'},
    {date: '2017-01-01', from: '11:00', to: '12:00', room: '346'},
    {date: '2017-01-01', from: '11:00', to: '12:00', room: '347'},
    {date: '2017-01-01', from: '11:00', to: '12:00', room: '348'},
    {date: '2017-01-01', from: '11:00', to: '12:00', room: '349'},
    {date: '2017-01-01', from: '11:00', to: '12:00', room: '350'}];

  constructor() { }
}
