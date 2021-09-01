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
   const mobileNumber = req.query.mobile_number;

   if (reservationDate && validation.isValidDate(reservationDate)) {
     res.locals.reservationDate = reservationDate;
     return next();
   } else if (mobileNumber && validation.isFieldProvided(mobileNumber)) {
     res.locals.mobileNumber = mobileNumber;
     return next();
   }
   return next({ status: 404, message: "Reservation date required" });
 }

 const reservationExists = async (req, res, next) => {
    const methodName = "reservationExists";
    const { reservationId } = req.params;
    if (reservationId && validation.isInteger(reservationId)) {
      const reservation = await service.read(reservationId);
      req.log.debug({ __filename, methodName, reservation });
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
     return next({ status: 400, message: "Number of people is required" });
   }
   if (!validation.isFieldNumber(res.locals.reservation.people)) {
     return next({ status: 400, message: "people must be a number" });
   }
   if (!validation.isNumberPositiveInteger(res.locals.reservation.people)) {
      return next({ status: 400, message: "Number of people must be greater than 0" });
   }
   return next();
 }

 const validateStatusIsBooked = (req, res, next) => {
  const status = res.locals.reservation.status;
  if (!status) {
    res.locals.reservation.status = "booked";
    return next();
  }

  if (!validation.isFieldProvided(status)) {
     return next({ status: 400, message: "status is required" });
  }
  if (!validation.isValidStatus(status)) {
    return next({ status: 400, message: "Status must be booked, seated, or finished" });
  }
  if (status === "seated") {
    return next({ status: 400, message: "Reservation is already seated" });
  }
  if (status === "finished") {
    return next({ status: 400, message: "Reservation can't be created with status 'finished" });
  }
  return next();
 }

 const list = async (req, res, next) => {
   if (res.locals.reservationDate) {
    const reservations = await service.list(res.locals.reservationDate);
    return res.json({
      data: reservations,
    });
   } else if (res.locals.mobileNumber) {
    const reservations = await service.searchByMobileNumber(res.locals.mobileNumber);
     return res.json({
       data: reservations,
     });
   } else {
     return next({ status: 404, message: "Page not found" });
   }
   next();
 }
 
 const create = async (req, res) => {
  // const methodName = "rescreate";
  if (req.body.data.reservation_id) {
    const updatedReservation = await service.update(req.body.data);
    res.status(201).json({
      data: updatedReservation,
    });
  } else {
    const newReservation = await service.create(req.body.data);
    // req.log.debug({ __filename, methodName, newReservation });
    res.status(201).json({
      data: newReservation,
    });
  }
 }

 const read = (req, res) => {
  // const methodName = "resread";
  // const reservation = res.locals.reservation;
  // req.log.debug({ __filename, methodName, reservation });
  res.json({ data: res.locals.reservation });
 }

 const update = async (req, res, next) => {
   const updatedReservation = await service.update(res.locals.reservation);
   res.json({ 
     data: updatedReservation 
   });
 }

 const updateStatus = async (req, res, next) => {
  const status = req.body.data.status;
  if (validation.isValidStatus(status)) {
    if (res.locals.reservation.status === "finished") {
      return next({ status: 400, message: "finished reservations cannot be updated" });
    }
    const reservation = await service.updateStatus(res.locals.reservation.reservation_id, status);
    return res.json({
      data: reservation,
    });
  }
  return next({ status: 400, message: "Status is unknown - must be booked, seated, finished, or cancelled" });
 }
 
 module.exports = {
   list: [getReservationDate, asyncErrorBoundary(list)],
   create: [hasData, validateFirstName, validateLastName, validateMobileNumber, validateReservationDate, validateReservationTime, validatePeople, validateStatusIsBooked, asyncErrorBoundary(create)],
   read: [asyncErrorBoundary(reservationExists), read],
   update: [reservationExists, hasData, validateFirstName, validateLastName, validateMobileNumber, validateReservationDate, validateReservationTime, validatePeople, asyncErrorBoundary(update)],
   updateStatus: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(updateStatus)],
 };
 