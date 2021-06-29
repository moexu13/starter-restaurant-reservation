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
   return next({ status: 404, message: "Reservation date required" });
 }
 
 const hasData = (req, res, next) => {
   if (req.body.data) {
     return next();
   }
   next({ status: 400, message: "Body must include data property" });
 }
 
 const list = async (req, res) => {
   const reservations = await service.list(res.locals.reservationDate);
   res.json({
     data: reservations,
   });
 }
 
 const create = async (req, res) => {
   const newReservation = await service.create(req.body.data);
 
   res.status(201).json({
     data: newReservation,
   });
 }
 
 module.exports = {
   list: [getReservationDate, asyncErrorBoundary(list)],
   create: [hasData, asyncErrorBoundary(create)],
 };
 