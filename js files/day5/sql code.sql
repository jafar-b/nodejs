create database day_5_nodejs;
use day_5_nodejs; 

create table authors (
    id int primary key auto_increment,
    name varchar(100) not null,
    country varchar(100),
    birth_year int
);

create table genres (
    id int primary key auto_increment,
    name varchar(100) not null,
    description varchar(255)
);

create table books (
    id int primary key auto_increment,
    title varchar(150) not null,
    author_id int,
    genre_id int,
    published_year int,
    price decimal(10,2),
    foreign key (author_id) references authors(id),
    foreign key (genre_id) references genres(id)
);

create table users (
    id int primary key auto_increment,
    name varchar(100) not null,
    email varchar(100) not null unique,
    age int,
    created_at datetime default current_timestamp
);

