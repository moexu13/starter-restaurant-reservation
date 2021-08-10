const knex = require("../db/connection");

const list = () => {
  return knex("tables")
    .select("*")
    .orderBy("table_name");
}

const create = newTable => {
  return knex("tables")
  .insert(newTable)
  .returning("*");
}

const read = tableId => {
  return knex("tables")
    .select("*")
    .where("table_id", tableId)
    .first();
}

const seatTable = async (tableId, reservationId) => {
  try {
    await knex.transaction(async trx => {
      return trx("tables")
        .where("table_id", tableId)
        .update({ reservation_id: reservationId })
        .then(() => {
          return trx("reservations")
            .where("reservation_id", reservationId)
            .update({ status: "seated" })
        })
        .then(updatedTable => updatedTable[0]);
    });
  } catch (error) {
    return error;
  }
}

const finishTable = async (tableId, reservationId) => {
  try {
    await knex.transaction(async trx => {
      return trx("tables")
        .where("table_id", tableId)
        .update({ reservation_id: null })
        .then(() => {
          return trx("reservations")
            .where("reservation_id", reservationId)
            .update({ status: "finished" })
        })
        .then(updatedTable => updatedTable[0]);
    });
  } catch (error) {
    return error;
  }
}

module.exports = {
  list,
  create,
  read,
  seatTable,
  finishTable,
}