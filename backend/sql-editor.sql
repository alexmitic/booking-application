create table bussines_partners (
    person_id int not null references people(person_id), 
    representing text not null,
    position text not null,
    primary key (person_id)
);

create table staff (
    person_id int not null references people(person_id),
    position text not null,
    primary key (person_id)
);

create table booking (
    booking_id SERIAL,
    date_of_booking date not null, 
    start_time time not null,
    end_time time not null,
    resource_id int not null references resources(resource_id), 
    made_by  int not null references people(person_id),
    constraint test check(start_time = end_time),
    primary key(booking_id)
);  
insert into booking (date_of_booking, start_time ,end_time, resource_id,made_by) 
values('2018-04-13', '12:16:00','09:13:00',5,5);


create table meeting (
    booking_id int not null references booking(booking_id),
    participant int not null references people(person_id),
    total_cost real not null
);
insert into meeting (booking_id, participant ,total_cost) 
values(10, 'testroom','skogen'),(15, 'nyttromm', 'huset');


create table people (
    person_id serial,
    full_name text not null,
    email text not null,
    hashed_password text not null,
    primary key(person_id)
);
insert into people (full_name, email ,hashed_password) 
values('gunner svenus','hotmail.se', 'hash'),('hagga svagga','gmail.se', 'hash');

create table resources (
    resource_id serial,
    cost real not null,
    room text not null,
    facility text not null,
    primary key(resource_id)
);
insert into resources (cost, room ,facility) 
values(10, 'testroom','skogen'),(15, 'nyttromm', 'huset');

create table teams (
    team_id SERIAL,
    team_name text not null,
    active boolean not null,
    primary key (team_id)
);

select cost*date_part('day',date_diff(end_time, start_time)) 
from booking
inner join
resources 
on booking.resource_id = resources.resource_id
where booking.booking_id = id;

CREATE OR REPLACE FUNCTION check_if_outpatient (id int)
RETURNS boolean AS $result$
declare
result boolean;
BEGIN
SELECT EXISTS(select patient_id from outpatients where id =
outpatients.patient_id)
RETURN result;
END;
create or replace function is_active (id int) 
    returns boolean as $result$
    declare 
    result boolean;
    begin 
    select exists(select team_id from teams where teams.active = true and teams.team_id = id) into result;
    return result; 
    end;
$result$ LANGUAGE plpgsql;
create table team_member (
    team_id int not null,
    person_id int not null references people (person_id),
    constraint active_team check(is_active(team_id) = true) 
);



--delete team
update teams set active = false where teams.team_id = id;

--add member to team
insert into team_member (team_id, person_id) 

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


-- Get all meetings for a person
SELECT booking.booking_id, date_of_booking, start_time, end_time, room 
FROM booking 
INNER JOIN resources 
ON booking.resource_id = resources.resource_id 
WHERE made_by = 1
UNION
SELECT meeting.booking_id, date_of_booking, start_time, end_time, room  
FROM meeting 
INNER JOIN booking 
ON meeting.booking_id = booking.booking_id
INNER JOIN resources 
ON booking.resource_id = resources.resource_id 
WHERE participant = 1;

