import {Component, Input, OnInit} from '@angular/core';
import {Booking, BookingsService, Meeting} from '../bookings.service';

@Component({
  selector: 'app-booking-page',
  templateUrl: './booking-page.component.html',
  styleUrls: ['./booking-page.component.css']
})
export class BookingPageComponent implements OnInit {

  bookings: Booking[];
  participants = ['Aleksandar Mitic', 'Aleksandar Mitic', 'Aleksandar Mitic', 'Aleksandar Mitic', 'Aleksandar Mitic']
  rooms = ['345', '234'];

  constructor(private bookingsService: BookingsService) {
    this.bookingsService.reqMeetings().then((data) => {
      console.log(data);
      this.bookings = data;
    });
  }

  ngOnInit() {
  }

  public showParticipants(room) {
    // TODO Set current meeting
    const participantDisplay = document.getElementById('informationBox');
    participantDisplay.style.visibility = 'visible';
  }

  public deleteMeeting() {
    // TODO
  }

}
