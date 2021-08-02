/**
 * List handler for tables resources
 */
 const service = require("./tables.service");
 const reservationService = require("../reservations/reservations.service");
 const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
 const validation = require("../utils/validation");

 const checkTableExists = async (req, res, next) => {
   const { tableId } = req.params;
   const table = await service.read(tableId);
   if (table) {
     res.locals.table = table;
     return next();
   }
   return next({ status: 404, message: `Table ${tableId} doesn't exist` });
 }

 const hasData = (req, res, next) => {
  if (req.body.data) {
    res.locals.table = req.body.data;
    return next();
  }
  next({ status: 400, message: "Body must include data property" });
}

const validateTableName = (req, res, next) => {
  if (!validation.isFieldProvided(res.locals.table.table_name)) {
    return next({ status: 400, message: "table_name is required"});
  }
  if (!validation.isFieldLengthValid(res.locals.table.table_name, 2)) {
    return next({ status: 400, message: "table_name must be at least 2 characters" });
  }
  return next();
}

const validateCapacity = (req, res, next) => {
  if (!validation.isFieldProvided(res.locals.table.capacity)) {
    return next({ status: 400, message: "capacity is required" });
  }
  if (!validation.isNumberPositiveInteger(res.locals.table.capacity)) {
     return next({ status: 400, message: "capacity must be a number greater than 0" });
  }
  return next();
}

const validateReservationId = (req, res, next) => {
  if (!validation.isFieldProvided(res.locals.table.reservation_id)) {
    return next({ status: 400, message: "reservation_id is required" })
  }
  return next();
}

 const checkReservationExists = async (req, res, next) => {
  // const methodName = "tables.checkReservationExists";
  // const data = req.body.data;
  // req.log.debug({ __filename, methodName, data }); 

  const reservation_id = req.body.data.reservation_id;
  if (!parseInt(reservation_id)) return next({ status: 404, message: "reservation_id invalid"});
  
  const reservation = await reservationService.read(reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  return next({ status: 404, message: `Reservation ${reservation_id} doesn't exist` });
 }

 const checkTableIsOccupied = (req, res, next) => {
   if (res.locals.table.reservation_id != null) {
     return next({ status: 400, message: `Table ${res.locals.table.table_name} is occupied` });
   }
   return next();
 }

 const checkTableCapacity = (req, res, next) => {
   const people = res.locals.reservation.people;
   const capacity = res.locals.table.capacity;
   const table = res.locals.table.table_name;
   if (people > capacity) {
     return next({ status: 400, message: `Table ${table} doesn't have the capacity for ${people}` });
   }
   return next();
 }

 const list = async (req, res) => {
  const tables = await service.list();
  res.json({
    data: tables,
  });
}

const read = (req, res) => {
  res.json({ data: res.locals.table });
}

const create = async (req, res, next) => {
  const newTable = await service.create(res.locals.table);
 
   res.status(201).json({
     data: newTable,
   });
}

const seatTable = async (req, res, next) => {
  // const methodName = "seatTable";
  // const tmp = res.locals.table;
  // req.log.debug({ __filename, methodName, tmp}); 

  const tableId = res.locals.table.table_id;
  const reservationId = res.locals.reservation.reservation_id;
  const table = await service.seatTable(tableId, reservationId);
  res.json({
    data: table,
  });
}

const finishTable = async (req, res, next) => {
  if (res.locals.table.reservation_id === null) {
    next({ status: 400, message: `Table ${res.locals.table.table_name} is not occupied`});
  }
  const updatedTable = await service.finishTable(res.locals.table.table_id);
  res.json({ data: updatedTable });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [hasData, validateTableName, validateCapacity, asyncErrorBoundary(create)],
  read: [asyncErrorBoundary(checkTableExists), read],
  seatTable: [hasData, validateReservationId, asyncErrorBoundary(checkTableExists), asyncErrorBoundary(checkReservationExists), checkTableIsOccupied, checkTableCapacity, asyncErrorBoundary(seatTable)],
  finishTable: [asyncErrorBoundary(checkTableExists), asyncErrorBoundary(finishTable)],
}