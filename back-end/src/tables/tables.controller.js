/**
 * List handler for tables resources
 */
 const service = require("./tables.service");
 const reservationService = require("../reservations/reservations.service");
 const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

 const checkTableExists = async (req, res, next) => {
   const { tableId } = req.params;
   const table = await service.read(tableId);
   if (table) {
     res.locals.table = table;
     return next();
   }
   return next({ status: 404, message: `Table ${tableId} doesn't exist`});
 }

 const checkReservationExists = async (req, res, next) => {
  // const methodName = "tables.checkReservationExists";
  const data = req.body.data;
  // req.log.debug({ __filename, methodName, data }); 

  const reservation_id = req.body.data.reservation_id;
  const reservation = await reservationService.read(reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  return next({ status: 404, message: `Reservation ${reservationId} doesn't exist` });
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
     return next({ status: 400, message: `Reservation is for ${people} and table ${table} only seats ${capacity}` });
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

const seatTable = async (req, res, next) => {
  const tableId = res.locals.table.table_id;
  const reservationId = res.locals.reservation.reservation_id;
  const table = await service.seatTable(tableId, reservationId);
  res.json({
    data: table,
  });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(checkTableExists), read],
  seatTable: [asyncErrorBoundary(checkTableExists), asyncErrorBoundary(checkReservationExists), checkTableIsOccupied, checkTableCapacity, asyncErrorBoundary(seatTable)],
}