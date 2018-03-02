create table bussines_partners (
    person_id int not null references people(person_id), 
    representing text not null,
    position text not null,
    primary key (person_id)
);
insert into bussines_partners (person_id, representing, position)
values (5,'Svantes stål Ab', 'PR ansvarig'),
       (6,'Svantes stål Ab', 'CEO');

create table staff (
    person_id int not null references people(person_id),
    position text not null,
    primary key (person_id)
);
insert into staff (person_id, position) 
values (1, 'It-admin'), 
       (2, 'Testare'), 
       (3, 'Stadare'),
       (4, 'Testare');

create or REPLACE function denied (arg_resource_id int, arg_date_of_booking date, arg_start_time time, arg_end_time time) 
    returns boolean as $result$
    declare 
    result boolean;
    begin 
    select exists(select booking.resource_id from booking where date_of_booking = arg_date_of_booking and booking.resource_id = arg_resource_id and (((start_time <= arg_start_time) and arg_start_time <= end_time) or ((start_time <= arg_end_time) and arg_end_time <= end_time) or (('10:00' <= start_time) and  end_time <= '12:00'))) into result;
    return result; 
    end;
$result$ LANGUAGE plpgsql;

create table booking (
    booking_id SERIAL,
    date_of_booking date not null check(current_date <= date_of_booking), 
    start_time time not null,
    end_time time not null check (start_time < end_time),
    resource_id int not null references resources(resource_id), 
    made_by  int not null references people(person_id),
    constraint is_denied check(denied(resource_id,date_of_booking,start_time, end_time) = false),
    primary key(booking_id)
);  

insert into booking (date_of_booking, start_time ,end_time, resource_id, made_by) 
values ('2018-04-13', '12:00:00', '13:00', 1, 1),
       ('2018-04-14', '12:16:00', '14:13', 2, 1),
       ('2018-04-14', '15:00:00', '16:00', 1, 1),
       ('2018-04-13', '10:00:00', '11:00', 2, 1);

create table meeting (
    booking_id int not null references booking(booking_id),
    participant int not null references people(person_id)
);
insert into meeting (booking_id, participant) 
values (1, 4),(1, 1);


create table people (
    person_id serial,
    full_name text not null,
    email text not null,
    hashed_password text not null,
    primary key(person_id)
);
insert into people (full_name, email, hashed_password) 
values ('Aleksandar Mitic','amitic@kth.se', 'password'),
       ('Oskar Nehlin','onhelin@kth.se', 'password'),
       ('Peter Svensson','psven@kth.se', 'password'),
       ('Anders Dahl','adahl@kth.se', 'password'),
       ('Anna Book','abook@kth.se', 'password'),
       ('Hanna Svan','hsvan@kth.se', 'password');

create table resources (
    resource_id serial,
    cost real not null check(cost > 0),
    room text not null,
    facility text not null,
    primary key(resource_id)
);
insert into resources (cost, room ,facility) 
values (10, 'D32','Whiteboard'),
       (15, 'E45', 'TV');

create table teams (
    team_id SERIAL,
    team_name text not null,
    active boolean not null,
    accumilated_cost real not null,
    primary key (team_id)
);
insert into teams (team_name, active, accumilated_cost)
values ('A - team', true, 0), 
       ('B - Team', true, 0), 
       ('C - Team', false, 0);

create or REPLACE function is_active (id int) 
    returns boolean as $result$
    declare 
    result boolean;
    begin 
    select exists(select team_id from teams where teams.active = true and teams.team_id = id) into result;
    return result; 
    end;
$result$ LANGUAGE plpgsql;
create table team_member (
    team_id int not null references teams(team_id),
    person_id int not null references people (person_id),
    constraint active_team check(is_active(team_id) = true) 
);
insert into team_member (team_id, person_id) values (1, 1), (1, 2), (2, 3), (2, 4);

select cost*date_part('day',date_diff(end_time, start_time)) 
from booking
inner join
resources 
on booking.resource_id = resources.resource_id
where booking.booking_id = id;  


-- Delete team a team
update teams set active = false where teams.team_id = id;

-- Add member to team
insert into team_member values (team_id, person_id) 

--answer what rooms are available in given timeslot
with available (resource_id) as (
    select booking.resource_id from  
        booking
        where ((start_time > '08:00:00') and start_time > ('11:00:00'))  or '08:00:00' > end_time
        and date_of_booking = date
)
select available.resource_id, resources.room from (available inner join resources on available.resource_id = resources.resource_id);

--Present occupation lists for all rooms on a given date
with available (resource_id) as (
    select booking.resource_id from  
        booking
        where date_of_booking = date
)
select available.resource_id, resources.room from (available inner join resources on available.resource_id = resources.resource_id);


--Show which users have booked which meetings
select people.full_name, meeting_id from meeting inner join people on made_by = person_id;


--Show cost accrued by teams for any given time interval.
with room_costs (team_id, cost) as (
    select teams.team_id, room_cost from 
    (select (resources.cost*(date_part('hour',end_time)-date_part('hour',start_time))) as room_cost, made_by, date_of_booking, start_time, end_time FROM booking
    inner join 
    resources 
    on booking.resource_id = resources.resource_id) as temp
    inner join 
    teams
    on
    teams.team_id = (select team_member.team_id from team_member inner join teams on person_id = temp.made_by and teams.active = true)
    where date_of_booking = '2018-04-14' and (((start_time <= '10:00') and '10:00' <= end_time) or ((start_time <= '12:00') and '12:00' <= end_time) or (('10:00' <= start_time) and  end_time <= '12:00'))
)
select sum(cost) from room_costs group by team_id;



-- total cost: look for the sum of the cost of the resources in all bookings
select sum(resources.cost*(date_part('hour',end_time)-date_part('hour',start_time))) as room_cost FROM booking
inner join 
resources 
on booking.resource_id = resources.resource_id;


-- Get all meetings for a person
select * from meeting inner join booking on meeting.booking_id = booking.booking_id where meeting.participant = %user 



update teams 
set accumilated_cost = accumilated_cost + room_cost::int
from 
(select (resources.cost*(date_part('hour',end_time)-date_part('hour',start_time))) as room_cost, made_by FROM booking
inner join 
resources 
on booking.resource_id = resources.resource_id) as temp
where teams.team_id = (select team_member.team_id from team_member inner join teams on person_id = temp.made_by and teams.active = true);
