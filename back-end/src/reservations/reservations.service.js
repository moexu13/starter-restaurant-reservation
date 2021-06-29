const knex = require("../db/connection");

const list = reservationDate => {
  return knex("reservations")
    .select("*")
    .where("reservation_date", reservationDate)
    .orderBy("reservation_time");
}

const create = newReservation => {
  return knex("reservations").insert(newReservation).returning("*");
}

module.exports = {
  list,
  create,
}