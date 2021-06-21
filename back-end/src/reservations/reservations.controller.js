/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const getReservationDate = (req, res, next) => {
  // const methodName = "reservations.getReservationDate";
  // req.log.debug({ __filename, methodName, query });
  const reservationDate = req.query.date;
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
