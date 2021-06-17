/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const getReservationDate = (req, res, next) => {
  let { reservationDate } = req.params;
  if (!reservationDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    reservationDate = today;
  }
  // console.log("date", reservationDate);
  res.locals.reservationDate = reservationDate;
  return next();
}

const list = async (req, res) => {
  const reservations = await service.list(res.locals.reservationDate);
  res.json({
    data: reservations,
  });
}

module.exports = {
  list: [getReservationDate, asyncErrorBoundary(list)],
};
