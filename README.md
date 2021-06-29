# Periodic Tables Restaurant Reservations
> This is Thinkful's capstone project. It's a system for a restaurant to manage reservations.

## Table of contents
* [General info](#general-info)
* [Technologies](#technologies)
* [Setup](#setup)
* [Status](#status)

## General info
This project is a Node API in front of a Postgres database. It uses Knex for database queries. 

## Technologies
* Node
* Knex
* Postgres

## Installation
1. Fork and clone this repository.
1. Run `cp ./back-end/.env.sample ./back-end/.env`.
1. Create four PostgreSQL database instances - development, test, preview, and production.
1. Update the `./back-end/.env` file with the connection URL's to your PostgreSQL database instance.
1. Run `cp ./front-end/.env.sample ./front-end/.env`.
1. You should not need to make changes to the `./front-end/.env` file unless you want to connect to a backend at a location other than `http://localhost:5000`.
1. Run `npm install` to install project dependencies.
1. Run `npm run start:dev` to start your server in development mode.

## Status
Project is in progress.

