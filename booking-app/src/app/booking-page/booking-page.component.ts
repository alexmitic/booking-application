import {Component, Input, OnInit} from '@angular/core';
import {Booking, BookingsService, Participants} from '../bookings.service';

@Component({
  selector: 'app-booking-page',
  templateUrl: './booking-page.component.html',
  styleUrls: ['./booking-page.component.css']
})
export class BookingPageComponent implements OnInit {

  bookings: Booking[];
  participants: Participants[];
  currentBookingId: number;

  constructor(private bookingsService: BookingsService) {
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
