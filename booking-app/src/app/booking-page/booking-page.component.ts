import {Component, OnInit, ViewChild} from '@angular/core';
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
  @ViewChild('select') selectedPeople;
  @ViewChild('selectRoom') selectedRoom;

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
        console.log(data);
      });

      this.bookingMeeting = true;
    } else {
      // Get selected participants
      const options = this.selectedPeople.nativeElement.options;
      let choosenPart = [];
      for (let i = 0; i < options.length; i++) {
        if (options[i].selected) {
          choosenPart.push(this.people[i].person_id);
        }
      }

      // Get room
      let choosenRoom;
      const roomOptions = this.selectedRoom.nativeElement.value;
      for (let i = 0; i < this.rooms.length; i++) {
        if (this.rooms[i].room = roomOptions) {
          choosenRoom = this.rooms[i].resource_id;
        }
      }

      // Get time
      const timeFrom = (<HTMLInputElement> document.getElementById('timeFrom')).value;
      const timeTo = (<HTMLInputElement> document.getElementById('timeTo')).value;

      // Get date
      const date = (<HTMLInputElement> document.getElementById('date')).value;

      const bookingObject = {
        date: date,
        start_time: timeFrom,
        end_time: timeTo,
        resource_id: choosenRoom,
        participants: choosenPart,
        made_by: this.bookingsService.personId
      };

      this.bookingsService.book(bookingObject);
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
