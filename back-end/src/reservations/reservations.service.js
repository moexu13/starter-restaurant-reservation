const knex = require("../db/connection");

const list = reservationDate => {
  return knex("reservations")
    .select("*")
    .where("reservation_date", reservationDate)
    .orderBy("reservation_time");
}

const read = reservationId => {
  return knex("reservations")
    .select("*")
    .where("reservation_id", reservationId)
    .first();
}

const create = newReservation => {
  return knex("reservations")
    .insert(newReservation)
    .returning("*");
}

module.exports = {
  list,
  create,
  read,
}