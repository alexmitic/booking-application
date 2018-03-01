import {Component, Input, OnInit} from '@angular/core';
import {Booking, BookingsService, Participants, Person, Room} from '../bookings.service';

@Component({
  selector: 'app-booking-page',
  templateUrl: './booking-page.component.html',
  styleUrls: ['./booking-page.component.css']
})
export class BookingPageComponent implements OnInit {

  bookings: Booking[];
  participants: Participants[];
  rooms: Room[];
  people: Person[];
  currentBookingId: number;
  bookingMeeting: boolean;

  constructor(private bookingsService: BookingsService) {
    this.bookingMeeting = false;
    this.bookingsService.reqMeetings().then((data) => {
      this.bookings = data;
    });
  }

  ngOnInit() {
  }

  public showParticipants(bookingId) {
    const participantDisplay = document.getElementById('informationBox');
    participantDisplay.style.visibility = 'visible';
    this.currentBookingId = bookingId;

    this.bookingsService.getParticipants(bookingId).then((data) => {
      this.participants = data;
    });
  }

  public makeBooking() {
    if (!this.bookingMeeting) {
      const meetingDisplay = (<HTMLInputElement> document.getElementById('editMeeting'));
      meetingDisplay.style.visibility = 'visible';

      const button = (<HTMLInputElement> document.getElementById('newMeetingButton'));
      button.textContent = 'Book';

      this.bookingsService.getRooms().then((data) => {
        this.rooms = data;
      });

      this.bookingsService.getpeople().then((data) => {
        this.people = data;
      });

      this.bookingMeeting = true;
    } else {
      const participants = (<HTMLInputElement> document.getElementById('people'));
      console.log('Here comes participants' + participants.value);

      let test = from.con
    }
  }

  public deleteBooking() {
    this.bookingsService.deleteBooking(this.currentBookingId);
  }

  public refreshBookings() {
    this.bookingsService.reqMeetings().then((data) => {
      this.bookings = data;
      console.log(this.bookings);
    });
  }

}
