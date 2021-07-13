const knex = require("../db/connection");

const list = () => {
  return knex("tables")
    .select("*")
    .orderBy("table_name");
}

const read = tableId => {
  return knex("tables")
  .select("*")
  .where("table_id", tableId)
  .first();
}

const seatTable = (tableId, reservationId) => {
  return knex("tables")
  .where("table_id", tableId)
  .update({ reservation_id: reservationId })
  .then(updatedTable => updatedTable[0]);
}

module.exports = {
  list,
  read,
  seatTable,
}