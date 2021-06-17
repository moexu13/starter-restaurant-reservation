const knex = require("../db/connection");

// const list = reservationDate => {
//   return knex("reservations").where("reservation_date", reservationDate).select("*");
// }

const list = reservationDate => {
  return knex("reservations").select("*");
}

module.exports = {
  list,
}