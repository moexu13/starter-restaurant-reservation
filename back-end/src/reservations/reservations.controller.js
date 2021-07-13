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

 const reservationExists = async (req, res, next) => {
    // const methodName = "reservationExists";
    const { reservationId } = req.params;
    const reservation = await service.read(reservationId); 
    // req.log.debug({ __filename, methodName, reservation });
    if (reservation) {
      res.locals.reservation = reservation;
      return next();
    }
    return next({ status: 404, message: "Reservation cannot be found"});
 }
 
 const hasData = (req, res, next) => {
   if (req.body.data) {
     res.locals.reservation = req.body.data;
     return next();
   }
   next({ status: 400, message: "Body must include data property" });
 }
 
 const validateReservationDate = (req, res, next) => {
  // const methodName = "reservations.validateresdate";
  const reservationDate = new Date(
    `${res.locals.reservation.reservation_date}T${res.locals.reservation.reservation_time}`
  );
  // req.log.debug({ __filename, methodName, reservationDate });
  
  // reservation can't be a Tuesday
  if (reservationDate.getUTCDay() === 2) {
    return next({ status: 400, message: "Reservations can't be made on Tuesdays"});    
  }
  // reservation can't be in the past
  const today = new Date();
  if (reservationDate < today) {
    return next({ status: 400, message: "Reservation date can't be in the past "});
  }
  return next();
 }

 const validateReservationTime = (req, res, next) => {
  const localsDate =  res.locals.reservation.reservation_date;
  const localsTime = res.locals.reservation.reservation_time;
  const reservationDate = new Date(`${localsDate}T${localsTime}`);
  const reservationTime = reservationDate.getTime();
  const openingTime = new Date(`${localsDate}T10:30:00`).getTime();
  const closingTime = new Date(`${localsDate}T21:30:00`).getTime(); 
  
  if (reservationTime < openingTime || reservationTime > closingTime) {
    return next({ status: 400, message: "Reservation must be between 10:30 AM and 9:30 PM"});
  }
  return next();
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

 const read = (req, res) => {
  // const methodName = "resread";
  // const reservation = res.locals.reservation;
  // req.log.debug({ __filename, methodName, reservation });
  res.json({ data: res.locals.reservation });
 }
 
 module.exports = {
   list: [getReservationDate, asyncErrorBoundary(list)],
   create: [hasData, validateReservationDate, validateReservationTime, asyncErrorBoundary(create)],
   read: [asyncErrorBoundary(reservationExists), read],
 };
 