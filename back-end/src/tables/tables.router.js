/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */
 const methodNotAllowed = require("../errors/methodNotAllowed");

 const router = require("express").Router();
 const controller = require("./tables.controller");
 
 router.route("/").get(controller.list).post(controller.create).all(methodNotAllowed);
 router.route("/:tableId").get(controller.read).all(methodNotAllowed);
 router.route("/:tableId/seat")
  .put(controller.seatTable)
  .delete(controller.finishTable)
  .all(methodNotAllowed);
 
 module.exports = router;
 