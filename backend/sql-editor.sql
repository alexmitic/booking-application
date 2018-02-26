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
    accumilated_costs int not null,
    primary key (team_id)
);

create table meeting (
    meeting_id int not null AUTO_INCREMENT,
    made_by int not null,
    booking_id int not null,
    resource_id int not null,
    participant int not null,
    primary key(meeting_id)
);
-- total cost: look for the sum of the cost of the resources in all bookings
--team cost look in team attribute.