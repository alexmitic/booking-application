create table bussines_partners (
    person_id int not null AUTO_INCREMENT, 
    representing text not null,
    position text not null,
    primary key (person_id)
);

create table staff (
    person_id int not null AUTO_INCREMENT,
    position text not null,
    primary key (person_id)
);

create table booking (
    booking_id int not null AUTO_INCREMENT,
    start_time timestamp not null,
    end_time timestamp not null,
    primary key(booking_id)
);
create table people (
    person_id int not null AUTO_INCREMENT,
    full_name text not null,
    email text not null,
    hashed_password text not null,
    primary key(person_id)
);

create table resources (
    resource_id int not null AUTO_INCREMENT,
    cost real not null,
    room text not null,
    facility text not null,
    primary key(resource_id)
);

create table teams (
    team_id int not null AUTO_INCREMENT,
    team_name text not null,
    active boolean not null,
    primary key (team_id)
);

create table team_member (
    team_id int not null,
    person_id int not null
);

create table meeting (
    meeting_id int not null AUTO_INCREMENT,
    made_by int not null,
    booking_id int not null,
    resource_id int not null,
    participant int not null,
    primary key(meeting_id)
);

--answer what rooms are available in given timeslot
with available (resource_id, room) as (
    select resources.resource_id, room from 
        meeting
        inner join 
        resources
        on 
        meeting.resource_id = resources.resource_id
        inner join 
        booking
        on 
        meeting_resource.booking_id = booking.booking_id
        where start_time > "my time" or "my time" > end_time
)
select resources.resource_id, resources.room from available right join resources on available.resource_id = resources.resource_id;

--Present occupation lists for all rooms on a given date
with available (room, resource_id) as (
    select room, resources.resource_id from 
        meeting
        inner join 
        resources
        on 
        meeting.resource_id = resources.resource_id
        inner join
        booking
        on 
        meeting.booking_id = booking.booking_id
        where dayofyear(start_time) != dayofyear(date) and dayofyear(end_time) != dayofyear(date)
)
select * from available;

--Show which users have booked which meetings
select people.full_name, meeting_id from meeting inner join people on made_by = person_id;


--Show cost accrued by teams for any given time interval.
with meeting_teams (meeting_id, team_id) as (
    select meeting_id,team_id from 
    meeting 
    inner join
    team_member
    on 
    meeeting.made_by = team_member.person_id
    --måste testas mer svårt att se utan att veta hur den här hade fungerat
)


-- total cost: look for the sum of the cost of the resources in all bookings
with meeting_resource(cost) as (
    select cost from 
        meeting
        inner join 
        resources
        on 
        meeting.resource_id = resources.resource_id
)
select sum(cost) from meeting_resource;
