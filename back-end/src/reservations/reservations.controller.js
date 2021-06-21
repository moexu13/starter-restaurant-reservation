/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const getReservationDate = (req, res, next) => {
  const { reservationDate } = req.params;
  if (reservationDate) {
    res.locals.reservationDate = reservationDate;
    return next();
  }
  return next({ status: 404, message: "Reservation date required"});
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
