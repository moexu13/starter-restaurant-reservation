/**
 * List handler for reservation resources
 */
 const service = require("./reservations.service");
 const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
 
 const validation = require("../utils/validation");
 
 const getReservationDate = (req, res, next) => {
   // const methodName = "reservations.getReservationDate";
   // req.log.debug({ __filename, methodName, query });
   const reservationDate = req.query.date;
   if (reservationDate && validation.isValidDate(reservationDate)) {
     res.locals.reservationDate = reservationDate;
     return next();
   }
   return next({ status: 404, message: "Reservation date required" });
 }

 const reservationExists = async (req, res, next) => {
    // const methodName = "reservationExists";
    const { reservationId } = req.params;
    if (reservationId && validation.isInteger(reservationId)) {
      const reservation = await service.read(reservationId);
      // req.log.debug({ __filename, methodName, reservation });
      if (reservation) {
        res.locals.reservation = reservation;
        return next();
      }
    }
    return next({ status: 404, message: `Reservation ${reservationId} cannot be found`});
 }
 
 const hasData = (req, res, next) => {
   if (req.body.data) {
     res.locals.reservation = req.body.data;
     return next();
   }
   next({ status: 400, message: "Body must include data property" });
 }

 const validateFirstName = (req, res, next) => {
  if (!validation.isFieldProvided(res.locals.reservation.first_name)) {
     return next({ status: 400, message: "first_name is required"});
   }
   return next();
 }

 const validateLastName = (req, res, next) => {
  if (!validation.isFieldProvided(res.locals.reservation.last_name)) {
    return next({ status: 400, message: "last_name is required"});
  }
  return next();
}

const validateMobileNumber = (req, res, next) => {
  if (!validation.isFieldProvided(res.locals.reservation.mobile_number)) {
    return next({ status: 400, message: "mobile_number is required" });
  }
  return next();
}
 
 const validateReservationDate = (req, res, next) => {
  // const methodName = "reservations.validateresdate";
  // req.log.debug({ __filename, methodName, reservationDate });
  const reservationDate = res.locals.reservation.reservation_date;
  if (!validation.isFieldProvided(reservationDate)) {
    return next({ status: 400, message: "reservation_date is required" });
  }

  if (!validation.isValidDate(reservationDate)) {
    return next({ status: 400, message: "Invalid reservation_date provided" });
  }
  
  // reservation can't be a Tuesday
  if (validation.isTuesday(res.locals.reservation.reservation_date)) {
    return next({ status: 400, message: "Restaurant is closed on Tuesdays" });    
  }
  // reservation can't be in the past 
  if (validation.isPastDate(res.locals.reservation.reservation_date)) {
    return next({ status: 400, message: "Reservation date must be in the future" });
  }
  return next();
 }

 const validateReservationTime = (req, res, next) => {
  const localsDate =  res.locals.reservation.reservation_date;
  const localsTime = res.locals.reservation.reservation_time;

  if (!validation.isFieldProvided(localsTime)) {
    return next({ status: 400, message: "reservation_time is required" });
  }

  if (!validation.isValidTime(localsTime)) {
    return next({ status: 400, message: "reservation_time is invalid" });
  }
  
  if (!validation.isRestaurantOpen(localsDate, localsTime)) {
    return next({ status: 400, message: "Reservation must be between 10:30 AM and 9:30 PM"});
  }
  return next();
 }

 const validatePeople = (req, res, next) => {
   if (!validation.isFieldProvided(res.locals.reservation.people)) {
     return next({ status: 400, message: "people is required" });
   }
   if (!validation.isNumberPositiveInteger(res.locals.reservation.people)) {
      return next({ status: 400, message: "people must be a number greater than 0" });
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
   create: [hasData, validateFirstName, validateLastName, validateMobileNumber, validateReservationDate, validateReservationTime, validatePeople, asyncErrorBoundary(create)],
   read: [asyncErrorBoundary(reservationExists), read],
 };
 