const knex = require("../db/connection");

const list = reservationDate => {
  return knex("reservations")
    .select("*")
    .where("reservation_date", reservationDate)
    .whereIn("status", ["booked", "seated"])
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
    .returning("*")
    .then(updatedTable => updatedTable[0]);
}

const updateStatus = (reservationId, status) => {
  return knex("reservations")
    .where("reservation_id", reservationId)
    .update({ status: status })
    .returning("*")
    .then(updatedTable => updatedTable[0]);
}

const finishTable = reservationId => {
  return knex("reservations")
    .where("reservation_id", reservationId)
    .update({ status: "finished" })
    .then(updatedTable => updatedTable[0]);
}

const searchByMobileNumber = mobile_number => {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

module.exports = {
  list,
  create,
  read,
  updateStatus,
  finishTable,
  searchByMobileNumber,
}