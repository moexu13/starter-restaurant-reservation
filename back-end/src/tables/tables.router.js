/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */
 const methodNotAllowed = require("../errors/methodNotAllowed");

 const router = require("express").Router();
 const controller = require("./tables.controller");
 
 // router.route("/:reservationDate").get(controller.list);
 router.route("/").get(controller.list).all(methodNotAllowed);
 
 module.exports = router;
 