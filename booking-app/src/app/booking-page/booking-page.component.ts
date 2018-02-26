import { Component, OnInit } from '@angular/core';
import {BookingsService, Meeting} from '../bookings.service';

@Component({
  selector: 'app-booking-page',
  templateUrl: './booking-page.component.html',
  styleUrls: ['./booking-page.component.css']
})
export class BookingPageComponent implements OnInit {

  meetings: Meeting[];
  participants = ['Aleksandar Mitic', 'Aleksandar Mitic', 'Aleksandar Mitic', 'Aleksandar Mitic', 'Aleksandar Mitic']

  constructor(private bookingsService: BookingsService) {
    this.meetings = bookingsService.meetings;
  }

  ngOnInit() {
    // TODO Get from server
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
